# Next.js + NestJS Todo App with Keycloak SSO

A complete full-stack application demonstrating modern authentication patterns:

- **Frontend:** Next.js 15 (App Router, React 18) with Keycloak SSO integration
- **Backend:** NestJS GraphQL API with JWT token validation
- **Authentication:** Keycloak for SSO, user management, and RBAC
- **Transport:** GraphQL over HTTP with authenticated requests
- **Deployment:** Docker Compose for complete local development

> **Ports:** API at **http://localhost:4000/graphql**, Web at **http://localhost:3000**, Keycloak at **http://localhost:8080**

---

## 🚀 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### 1) Start Everything with Docker

```bash
# Clone and start the entire stack
git clone <your-repo>
cd next-nest-todo-keycloak

# Start all services (Keycloak, API, Web, PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f
```

**Services will be available at:**

- 🌐 **Web App**: http://localhost:3000
- 🔧 **GraphQL API**: http://localhost:4000/graphql
- 🔐 **Keycloak Admin**: http://localhost:8080 (admin/admin)
- 🗄️ **PostgreSQL**: localhost:5432

### 2) Configure Keycloak (First Time Setup)

```bash
# Wait for Keycloak to start, then configure
# Follow the "Keycloak Configuration" section below
```

### 3) Test the SSO Flow

1. Visit http://localhost:3000
2. Click "Login with Keycloak"
3. Create a user or login with test credentials
4. Experience the full SSO authentication flow

---

## 🛠️ Local Development (Without Docker)

### 1) Start Keycloak

```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

### 2) Install & Run API (NestJS)

```bash
cd apps/api
npm install
npm run start:dev
# API at http://localhost:4000/graphql
```

### 3) Install & Run Web (Next.js)

```bash
cd apps/web
npm install
npm run dev
# Web at http://localhost:3000
```

---

# Keycloak: goals, configuration, and backend integration

This sample includes a **frontend-only** Keycloak demo (using `keycloak-js`) so you can see login/logout and token attachment to GraphQL calls. Below are practical steps to turn it into production-grade auth (with the **backend validating tokens** or using a **BFF session**).

## Why Keycloak here (goals)

- **Standards-based OIDC/OAuth2** for the app (Auth Code + PKCE).
- **User management & SSO** with social providers if desired.
- **RBAC**: realm/client roles → enforce in Nest resolvers.
- **Future-ready**: swap to Zitadel/Auth0/Okta later with minimal code changes.

## Frontend configuration (Next.js)

Set these in `apps/web/.env.local`:

```
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=myrealm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=my-react-spa
GRAPHQL_URL=http://localhost:4000/graphql
```

### Client settings in Keycloak (important)

Create a **Public** client (for SPA):

- **Client ID**: `my-react-spa`
- **Standard Flow**: ON (Authorization Code)
- **PKCE**: ON
- **Valid Redirect URIs**: `http://localhost:3000/*`
- **Web Origins**: `http://localhost:3000`
- (Optional) **Logout redirect**: `http://localhost:3000`

> The SPA uses `silent-check-sso.html` for **check-sso**; make sure the origin matches exactly.

### Roles & claims (recommended)

- Define realm roles like `user`, `admin` (Realm Settings → Roles).
- In **Client Scopes** or **Client → Mappers**, expose roles in the **access token** (e.g., `realm_access.roles`). This allows the backend to check roles without extra calls.

## Backend integration options (Nest.js)

You have two secure patterns. Choose one:

### A) **JWT on the backend (no session)**

The UI gets tokens from Keycloak and attaches `Authorization: Bearer <token>` to GraphQL requests. The **Nest** API validates JWT on every call.

**Pros:** stateless; simple horizontally.  
**Cons:** tokens live in the browser; protect carefully; handle refresh.

**Steps:**

1. Install JWT + JWKS verification libs:

   ```bash
   npm i jsonwebtoken jwks-rsa
   npm i -D @types/jsonwebtoken
   ```

2. Add a **JWT guard** that validates token signature, issuer, audience, and extracts roles:

   ```ts
   // apps/api/src/auth/jwt.guard.ts
   import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
   import * as jwt from 'jsonwebtoken';
   import jwksClient from 'jwks-rsa';
   import { GqlExecutionContext } from '@nestjs/graphql';

   const issuer = process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/myrealm';
   const audience = process.env.KEYCLOAK_AUDIENCE || 'my-react-spa';

   const client = jwksClient({
     jwksUri: `${issuer}/protocol/openid-connect/certs`,
     cache: true,
     cacheMaxEntries: 5,
     cacheMaxAge: 10 * 60 * 1000,
   });

   function getKey(header, callback) {
     client.getSigningKey(header.kid, (err, key: any) => {
       if (err) return callback(err);
       const signingKey = key.getPublicKey();
       callback(null, signingKey);
     });
   }

   @Injectable()
   export class JwtGuard implements CanActivate {
     canActivate(ctx: ExecutionContext) {
       const c = GqlExecutionContext.create(ctx);
       const req = c.getContext().req;
       const auth = req.headers.authorization || '';
       const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
       if (!token) throw new UnauthorizedException('Missing token');

       return new Promise((resolve, reject) => {
         jwt.verify(token, getKey, { algorithms: ['RS256'], audience, issuer }, (err, decoded: any) => {
           if (err) return reject(new UnauthorizedException('Invalid token'));
           req.user = {
             sub: decoded.sub,
             username: decoded.preferred_username,
             roles: decoded.realm_access?.roles || [],
           };
           resolve(true);
         });
       }) as any;
     }
   }
   ```

3. Protect resolvers and check roles:

   ```ts
   // apps/api/src/auth/roles.guard.ts
   import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
   import { GqlExecutionContext } from '@nestjs/graphql';

   @Injectable()
   export class RolesGuard implements CanActivate {
     constructor(private roles: string[]) {}
     canActivate(ctx: ExecutionContext) {
       const c = GqlExecutionContext.create(ctx);
       const req = c.getContext().req;
       const user = req.user;
       if (!user) throw new ForbiddenException();
       const ok = this.roles.some((r) => user.roles?.includes(r));
       if (!ok) throw new ForbiddenException('Insufficient role');
       return true;
     }
   }
   ```

   ```ts
   // apps/api/src/todo/todo.resolver.ts (example)
   import { UseGuards } from '@nestjs/common';
   import { JwtGuard } from '../auth/jwt.guard';
   import { RolesGuard } from '../auth/roles.guard';

   @UseGuards(JwtGuard) // authenticate all fields in this resolver
   @Resolver(() => Todo)
   export class TodoResolver {
     // ...
     @UseGuards(new RolesGuard(['admin']))
     @Mutation(() => Boolean)
     deleteTodo(@Args('id', { type: () => ID }) id: string): boolean {
       return this.service.delete(id);
     }
   }
   ```

4. Add `.env` for API:
   ```bash
   # apps/api/.env
   KEYCLOAK_ISSUER=http://localhost:8080/realms/myrealm
   KEYCLOAK_AUDIENCE=my-react-spa
   ```

> Tip: In production, also configure **CORS** carefully and consider **rate limits** on mutations.

### B) **BFF session (recommended for web)**

A BFF (Next.js Route Handlers or Nest) performs the OIDC flow and stores tokens **server-side**; the browser only holds an **httpOnly session cookie**. The BFF calls the API with a backend token.

**Pros:** no tokens in JS; better CSRF posture; easy SSR.  
**Cons:** stateful (session storage), extra moving part.

Minimal steps with **Next.js BFF**:

- Implement `/auth/login` and `/auth/callback` (Authorization Code + PKCE).
- Store a session id in an **httpOnly** cookie; map it to tokens server-side (Redis/memory for dev).
- In server components/route handlers, forward a **backend access token** to the API.
- Nest verifies JWT as in option A (no browser token).

> If you prefer **Nest as BFF**, do the OIDC flow in Nest, set the cookie for `.localhost`, and let Next just consume the cookie.

## CORS, CSRF, Cookies

- With pure Bearer tokens (option A), set:
  - API CORS: `origin: http://localhost:3000`, `credentials: true` (for future cookies)
  - Use **POST** for GraphQL; consider **CSRF** if you later adopt cookies.
- With BFF cookies (option B):
  - Cookies: `Secure`, `httpOnly`, `SameSite=Lax` (or `Strict` if UX allows)
  - CSRF: double-submit token or same-site defense for mutations.

## Environment variables (summary)

**Web (`apps/web/.env.local`)**

```
NEXT_PUBLIC_KEYCLOAK_URL=...
NEXT_PUBLIC_KEYCLOAK_REALM=...
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=...
GRAPHQL_URL=http://localhost:4000/graphql
```

**API (`apps/api/.env`)**

```
KEYCLOAK_ISSUER=http://localhost:8080/realms/myrealm
KEYCLOAK_AUDIENCE=my-react-spa
```

## Troubleshooting

- **login stays on Keycloak page**: check redirect URI and web origins exactly match `http://localhost:3000`.
- **401 from API**: verify token audience (client id) and issuer match; confirm JWKS URL is reachable.
- **roles missing**: in Keycloak, ensure `realm_access.roles` or a custom mapper is included in the **Access Token**.
- **CORS errors**: API must include your web origin and `credentials: true` if cookies are used.
- **Clock skew**: keep Keycloak and API time in sync; allow a few seconds skew if needed.

---

## Roadmap ideas

- Replace in-memory todos with **Prisma + Postgres**.
- Add **audit interceptor** to send user actions to OpenSearch.
- Introduce **org/tenant claims** and ABAC (attribute-based) checks in resolvers.
- Switch to **Zitadel/Auth0** by updating issuer/metadata and client config.

---

## 🔐 Keycloak SSO Setup & Configuration

### Quick Start - Complete Stack

```bash
# Start all services (Keycloak, API, Web, PostgreSQL)
docker-compose up -d

# View logs to monitor startup
docker-compose logs -f keycloak

# Wait for Keycloak to be ready, then configure
```

### Access Keycloak Admin Console

- **URL**: http://localhost:8080
- **Username**: `admin`
- **Password**: `admin`

### Step-by-Step Keycloak Configuration

#### 1. Create a Realm

1. Go to the Admin Console
2. Click "Create Realm"
3. **Name**: `myrealm`
4. Click "Create"

#### 2. Create a Client

1. In your realm, go to "Clients"
2. Click "Create client"
3. Configure basic settings:
   - **Client ID**: `my-react-spa`
   - **Client type**: `OpenID Connect`
   - **Client authentication**: `Off` (public client)
4. Click "Next"
5. Configure capabilities:
   - **Standard flow**: `On`
   - **Direct access grants**: `On`
6. Click "Next"
7. Configure access settings:
   - **Valid redirect URIs**: `http://localhost:3000/*`
   - **Valid post logout redirect URIs**: `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
8. Click "Save"

#### 3. Create a Test User

1. Go to "Users" in your realm
2. Click "Create new user"
3. Configure user details:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **First name**: `Test`
   - **Last name**: `User`
4. Click "Create"
5. Go to "Credentials" tab
6. Click "Set password"
7. Set password: `password123`
8. Turn off "Temporary"
9. Click "Save"

### Testing the Complete SSO Flow

#### 1. Start the Stack

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs for troubleshooting
docker-compose logs -f
```

#### 2. Test Authentication

1. Visit http://localhost:3000
2. Click "Login with Keycloak"
3. Login with `testuser` / `password123`
4. You should be redirected back and see your authenticated user info
5. Try creating todos - they should work with authentication

#### 3. Test SSO Features

- **Single Sign-On**: Open multiple browser tabs, login in one → authenticated in all
- **Token-based Auth**: All GraphQL requests include JWT tokens
- **User Profile**: Display user information from Keycloak
- **Secure API**: Backend validates Keycloak tokens
- **Session Management**: Automatic token refresh and logout
- **PKCE Security**: Enhanced security for public clients

---

## 🏗️ Architecture & Features

### Frontend (Next.js)

- **AuthProvider**: React context for authentication state management
- **AuthButton**: Login/logout component with user profile display
- **Protected Routes**: Content varies based on authentication status
- **Token Management**: Automatic token refresh and secure storage
- **SSO Integration**: Seamless Keycloak integration with PKCE

### Backend (NestJS)

- **KeycloakGuard**: JWT token validation using Keycloak's public keys
- **Protected Resolvers**: All GraphQL operations require authentication
- **User Context**: Access to authenticated user information
- **CORS Configuration**: Proper cross-origin setup for authentication

### Authentication Flow

1. **Login**: User clicks login → redirected to Keycloak
2. **Authentication**: User enters credentials in Keycloak
3. **Token Exchange**: Authorization code exchanged for JWT tokens
4. **API Calls**: Frontend attaches Bearer token to GraphQL requests
5. **Token Validation**: Backend validates JWT against Keycloak
6. **User Context**: User information available in resolvers

---

## 📁 Project Structure

```
next-nest-todo-keycloak/
├── docker-compose.yml           # Complete Docker stack
├── README.md                   # Complete setup and usage guide
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── lib/
│   │   │   ├── auth.ts         # Keycloak client configuration
│   │   │   ├── AuthProvider.tsx # React authentication context
│   │   │   └── apollo.ts       # GraphQL client with auth headers
│   │   ├── components/
│   │   │   ├── AuthButton.tsx  # Login/logout component
│   │   │   └── TodoClient.tsx  # Protected todo interface
│   │   ├── public/
│   │   │   └── silent-check-sso.html # SSO silent check
│   │   ├── Dockerfile
│   │   └── .env.local          # Environment variables
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── auth/
│       │   │   └── keycloak.guard.ts # JWT validation guard
│       │   ├── todo/
│       │   │   └── todo.resolver.ts  # Protected GraphQL resolvers
│       │   └── main.ts         # CORS configuration
│       ├── Dockerfile
│       └── .env                # Environment variables
```

---

## 🔧 Environment Variables

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=myrealm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=my-react-spa
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

### Backend (`apps/api/.env`)

```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENT_ID=my-react-spa
```

---

## 🐳 Docker Commands

### Essential Commands

```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Stop and remove volumes (reset all data)
docker-compose down -v
```

### Development Workflow

```bash
# Start development environment
docker-compose up -d

# View real-time logs
docker-compose logs -f

# Restart specific service
docker-compose restart api

# Rebuild after code changes
docker-compose up --build api web

# Install new dependencies
docker-compose exec api npm install
docker-compose exec web npm install
```

### Monitoring & Debugging

```bash
# Check service status
docker-compose ps

# View logs for specific service
docker-compose logs -f keycloak
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres

# Execute commands in containers
docker-compose exec api bash
docker-compose exec web sh

# View container resource usage
docker stats
```

### Complete Reset

```bash
# Nuclear option - reset everything
docker-compose down -v --rmi all
docker system prune -f
docker-compose up -d --build
```

### Production Commands

```bash
# Start in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale api=3

# Update specific service
docker-compose pull api
docker-compose up -d api
```

---

## 🧪 Testing SSO Features

### 1. Single Sign-On

- Open multiple browser tabs to http://localhost:3000
- Login in one tab → automatically authenticated in others
- Logout from one tab → logged out from all tabs

### 2. Token-Based Authentication

- All GraphQL requests include `Authorization: Bearer <token>`
- Backend validates tokens against Keycloak's public keys
- Automatic token refresh every 10 seconds

### 3. User Profile Integration

- User information displayed from Keycloak token
- Username, email, and other claims available
- Profile updates in Keycloak reflect immediately

### 4. Protected Resources

- Unauthenticated users see login prompt
- Authenticated users can create/manage todos
- All API operations require valid JWT tokens

---

## 🚨 Troubleshooting

### Common Issues

**Keycloak not accessible:**

```bash
# Check if Keycloak is running
docker-compose ps keycloak

# View Keycloak logs
docker-compose logs keycloak

# Restart Keycloak if needed
docker-compose restart keycloak
```

**Dependencies missing (TypeScript errors):**

```bash
# Install missing dependencies in API
cd apps/api
npm install

# Or rebuild the API container
docker-compose up --build api
```

**Authentication not working:**

- Verify redirect URIs match exactly: `http://localhost:3000/*`
- Check Web origins: `http://localhost:3000`
- Ensure client is public (not confidential)
- Check browser console for errors
- Verify environment variables are loaded

**API returning 401 (Unauthorized):**

```bash
# Check API logs for token validation errors
docker-compose logs api

# Verify Keycloak is accessible from API container
docker-compose exec api curl http://keycloak:8080/realms/myrealm
```

**CORS errors:**

- Ensure API CORS includes frontend origin
- Check that credentials are included in requests
- Verify Web origins in Keycloak client settings

**Token validation errors:**

- Ensure Keycloak is running on port 8080
- Check that the realm name matches in all configs
- Verify the client ID is correct
- Check JWT token format in browser dev tools

**Services not starting:**

```bash
# Check all service status
docker-compose ps

# View all logs
docker-compose logs

# Check specific service
docker-compose logs web
docker-compose logs api
```

### Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove images (optional - forces rebuild)
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

### Development Tips

```bash
# Start only specific services
docker-compose up keycloak postgres

# Run API locally while using Docker Keycloak
cd apps/api && npm run start:dev

# View real-time logs
docker-compose logs -f --tail=100

# Execute commands in running containers
docker-compose exec api npm install
docker-compose exec web npm run build
```

---

## 🚀 Production Considerations

### Security

- Use HTTPS in production
- Set secure cookie flags
- Implement proper CORS policies
- Use environment-specific Keycloak realms
- Enable rate limiting on authentication endpoints

### Scalability

- Use Redis for session storage
- Implement token caching strategies
- Consider using Keycloak clustering
- Set up proper monitoring and logging

### Database

- Replace in-memory todos with PostgreSQL/MongoDB
- Implement proper user data isolation
- Add audit logging for user actions

---

## 📚 Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [GraphQL Authentication](https://graphql.org/learn/authorization/)
- [Docker Compose Guide](https://docs.docker.com/compose/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details
