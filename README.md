# 🚀 Next.js + NestJS Todo App with Keycloak SSO

> **Enterprise-Grade Full-Stack Authentication Demo**

A comprehensive demonstration of modern web application architecture featuring **Single Sign-On (SSO)** authentication, built with industry-standard technologies and best practices.

## ✨ **Key Features**

### 🔐 **Authentication & Security**

- **Keycloak SSO Integration** - Enterprise-grade identity and access management
- **OIDC/OAuth2 Flow** - Standards-compliant authentication with PKCE security
- **JWT Token Validation** - Secure API access with automatic token refresh
- **User Profile Management** - Complete user information from identity provider
- **Session Management** - Proper login/logout with redirect handling

### 🎨 **User Interface & Experience**

- **Clean, Modern Design** - Simplified, professional Todo interface
- **Responsive Layout** - Works seamlessly across different screen sizes
- **Intuitive Controls** - Clear delete buttons with "×" symbols for easy identification
- **User Avatar** - Personalized interface with user initials
- **Optimized Styling** - Reliable Tailwind CSS implementation without SVG sizing issues

### 🏗️ **Modern Architecture**

- **Next.js 15** - Latest React framework with App Router and Server Components
- **NestJS** - Scalable Node.js framework with GraphQL API
- **TypeScript** - Full type safety across frontend and backend
- **GraphQL** - Efficient data fetching with Apollo Client/Server
- **Docker Compose** - Complete containerized development environment

### 🚀 **DevOps & Quality**

- **GitHub Actions CI/CD** - Automated testing, building, and deployment
- **Multi-stage Pipeline** - Build testing, Docker integration, security scanning
- **Security Auditing** - Automated vulnerability scanning with npm audit
- **Hot Reload Development** - Instant feedback during development
- **Production-Ready** - Optimized builds and deployment configurations

## 🛠️ **Technology Stack**

| Layer              | Technologies                                                  |
| ------------------ | ------------------------------------------------------------- |
| **Frontend**       | Next.js 15, React 18, TypeScript, Tailwind CSS, Apollo Client |
| **Backend**        | NestJS, GraphQL, Apollo Server, JWT validation, TypeScript    |
| **Authentication** | Keycloak, OIDC/OAuth2, PKCE, JWT tokens                       |
| **Database**       | PostgreSQL (Docker), In-memory (development)                  |
| **DevOps**         | Docker Compose, GitHub Actions, Automated testing             |
| **Development**    | Hot reload, ESLint, Prettier, TypeScript strict mode          |

## 🎯 **Perfect For**

- 📚 **Learning modern authentication patterns** and SSO implementation
- 💼 **Portfolio demonstration** of full-stack development skills
- 🏗️ **Project foundation** for enterprise applications
- 🎓 **Understanding** Next.js, NestJS, and GraphQL integration
- 🐳 **Docker containerization** and DevOps best practices

> **Ports:** API at **http://localhost:4000/graphql**, Web at **http://localhost:3000**, Keycloak at **http://localhost:8080**

---

## 📊 **What You'll Learn**

### **Authentication Concepts**

- ✅ Single Sign-On (SSO) implementation with Keycloak
- ✅ OIDC/OAuth2 authorization flows and security patterns
- ✅ JWT token lifecycle management and validation
- ✅ PKCE security for public clients
- ✅ User session management and profile integration

### **Full-Stack Development**

- ✅ Next.js App Router and Server Components
- ✅ NestJS GraphQL API development with guards
- ✅ TypeScript across the entire stack
- ✅ Apollo Client/Server integration
- ✅ Docker containerization and orchestration

### **DevOps & Best Practices**

- ✅ GitHub Actions CI/CD pipelines
- ✅ Automated testing and security scanning
- ✅ Production deployment strategies
- ✅ Code quality and linting standards

---

## 🆕 **Recent Updates & Improvements**

### **UI/UX Enhancements (Latest)**

- ✅ **Fixed SVG Sizing Issues** - Resolved oversized icons and buttons in TodoClient component
- ✅ **Simplified Design** - Clean, professional interface with reliable Tailwind CSS classes
- ✅ **Improved Delete Buttons** - Clear "×" symbols for intuitive todo deletion
- ✅ **User Avatar** - Personalized interface showing user initials instead of problematic SVG icons
- ✅ **Optimized Styling** - Removed complex gradients and animations for better compatibility
- ✅ **Enhanced Accessibility** - Better focus states and visual feedback

### **Authentication Improvements**

- ✅ **Robust JWT Validation** - Enhanced KeycloakGuard with direct public key fetching
- ✅ **Better Error Handling** - Improved authentication error messages and fallbacks
- ✅ **Docker Network Optimization** - Fixed service communication issues

### **Development Experience**

- ✅ **Simplified Setup** - One-command Docker Compose deployment
- ✅ **Better Documentation** - Comprehensive troubleshooting and setup guides
- ✅ **CI/CD Pipeline** - Automated testing and security scanning

---

## 🚀 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### 1) Start Everything with Docker

```bash
# Clone and start the entire stack
git clone <your-repo>
cd next-nest-sso

# Start all services (Keycloak with auto-configuration, API, Web, PostgreSQL)
docker compose up -d

# View logs
docker compose logs -f
```

**Services will be available at:**

- 🌐 **Web App**: http://localhost:3000
- 🔧 **GraphQL API**: http://localhost:4000/graphql
- 🔐 **Keycloak Admin**: http://localhost:8080 (admin/admin)
- 🗄️ **PostgreSQL**: localhost:5432

### 2) Automatic Keycloak Configuration

**✅ No manual setup required!** The Keycloak realm, client, and test user are automatically configured when you run `docker compose up -d`.

The configuration includes:

- **Realm**: `myrealm`
- **Client**: `my-react-spa` (public client)
- **Test User**: `testuser` / `password123`
- **Redirect URIs**: `http://localhost:3000/*`

If you need to modify the configuration, edit `keycloak-realm-config.json` and restart the containers.

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
docker compose up -d

# View logs to monitor startup
docker compose logs -f keycloak

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
docker compose up -d

# Check service status
docker compose ps

# View logs for troubleshooting
docker compose logs -f
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

## 🔐 SSO Authentication Flow with Keycloak

### Complete Request Flow Diagram

This diagram shows the complete SSO authentication flow from login to logout, including all requests and redirects between the browser, Next.js app, Keycloak, and NestJS API.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SSO LOGIN FLOW (localhost:3000)                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Browser  │         │ Next.js  │         │ Keycloak │         │ NestJS   │
│          │         │ (Web)    │         │ (SSO)    │         │ (API)    │
│ :3000    │         │ :3000    │         │ :8080    │         │ :4000    │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Visits Application (Unauthenticated)                               │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  GET /             │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  HTML + JS         │                    │                    │
     │  (AuthProvider)    │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │  initKeycloak()    │                    │                    │
     │  check-sso         │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │                    │  Check Session     │                    │
     │                    │  (silent iframe)   │                    │
     │                    ├───────────────────>│                    │
     │                    │                    │                    │
     │                    │  No Session        │                    │
     │                    │<───────────────────┤                    │
     │                    │                    │                    │
     │  Not Authenticated │                    │                    │
     │  Show Login Button │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: User Clicks "Login with Keycloak" Button                                │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  Click Login       │                    │                    │
     │  Button            │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  keycloak.login()  │                    │                    │
     │  Generate PKCE     │                    │                    │
     │  code_challenge    │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  Redirect to Keycloak Login            │                    │
     │  /realms/myrealm/protocol/openid-connect/auth               │
     │  ?client_id=my-react-spa               │                    │
     │  &redirect_uri=http://localhost:3000   │                    │
     │  &response_type=code                   │                    │
     │  &code_challenge=...                   │                    │
     │  &code_challenge_method=S256           │                    │
     ├────────────────────────────────────────>│                    │
     │                    │                    │                    │
     │  Keycloak Login Page                   │                    │
     │<────────────────────────────────────────┤                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: User Enters Credentials in Keycloak                                     │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  POST /login       │                    │                    │
     │  username=testuser │                    │                    │
     │  password=password123                   │                    │
     ├────────────────────────────────────────>│                    │
     │                    │                    │                    │
     │                    │  Validate Credentials                   │
     │                    │  Create Session    │                    │
     │                    │  Generate Auth Code│                    │
     │                    │                    │                    │
     │  Redirect to App with Auth Code        │                    │
     │  http://localhost:3000                 │                    │
     │  ?code=AUTH_CODE                       │                    │
     │  &state=...                            │                    │
     │<────────────────────────────────────────┤                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Exchange Authorization Code for Tokens                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  GET /?code=...    │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  keycloak.init()   │                    │                    │
     │  Detect auth code  │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │                    │  POST /token       │                    │
     │                    │  grant_type=authorization_code          │
     │                    │  code=AUTH_CODE    │                    │
     │                    │  code_verifier=... │                    │
     │                    │  client_id=my-react-spa                 │
     │                    ├───────────────────>│                    │
     │                    │                    │                    │
     │                    │  Validate Code     │                    │
     │                    │  Verify PKCE       │                    │
     │                    │  Generate Tokens   │                    │
     │                    │                    │                    │
     │                    │  {                 │                    │
     │                    │    access_token: "eyJhbGc...",          │
     │                    │    id_token: "eyJhbGc...",              │
     │                    │    refresh_token: "eyJhbGc...",         │
     │                    │    token_type: "Bearer",                │
     │                    │    expires_in: 300                      │
     │                    │  }                 │                    │
     │                    │<───────────────────┤                    │
     │                    │                    │                    │
     │  Store Tokens      │                    │                    │
     │  Parse User Info   │                    │                    │
     │  authenticated=true│                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │  Show User Profile │                    │                    │
     │  & Todo Interface  │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Making Authenticated API Requests                                       │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  Create Todo       │                    │                    │
     │  (User Action)     │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  GraphQL Mutation  │                    │                    │
     │  POST /graphql     │                    │                    │
     │  Authorization: Bearer eyJhbGc...       │                    │
     │  { mutation: createTodo(...) }          │                    │
     ├─────────────────────────────────────────────────────────────>│
     │                    │                    │                    │
     │                    │                    │  Extract Token     │
     │                    │                    │  from Header       │
     │                    │                    │                    │
     │                    │                    │  Fetch JWKS        │
     │                    │                    │  Public Keys       │
     │                    │                    ├───────────────────>│
     │                    │                    │                    │
     │                    │                    │  Public Keys       │
     │                    │                    │<───────────────────┤
     │                    │                    │                    │
     │                    │                    │  Verify JWT        │
     │                    │                    │  Signature         │
     │                    │                    │  Check Expiry      │
     │                    │                    │  Validate Issuer   │
     │                    │                    │  Validate Audience │
     │                    │                    │                    │
     │                    │                    │  Extract User Info │
     │                    │                    │  from Token        │
     │                    │                    │  (sub, username,   │
     │                    │                    │   roles, etc.)     │
     │                    │                    │                    │
     │                    │                    │  Execute Mutation  │
     │                    │                    │  with User Context │
     │                    │                    │                    │
     │  { data: { createTodo: {...} } }       │                    │
     │<─────────────────────────────────────────────────────────────┤
     │                    │                    │                    │
     │  Update UI         │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Token Refresh (Automatic, every 10 seconds)                             │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  Token Refresh     │                    │                    │
     │  Timer Triggered   │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │                    │  POST /token       │                    │
     │                    │  grant_type=refresh_token               │
     │                    │  refresh_token=... │                    │
     │                    │  client_id=my-react-spa                 │
     │                    ├───────────────────>│                    │
     │                    │                    │                    │
     │                    │  New Tokens        │                    │
     │                    │  {                 │                    │
     │                    │    access_token: "new_token...",        │
     │                    │    refresh_token: "new_refresh...",     │
     │                    │    expires_in: 300 │                    │
     │                    │  }                 │                    │
     │                    │<───────────────────┤                    │
     │                    │                    │                    │
     │  Tokens Updated    │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ STEP 7: User Clicks Logout Button                                               │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  Click Logout      │                    │                    │
     │  Button            │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  logout()          │                    │                    │
     │  Clear Local State │                    │                    │
     │  Clear Storage     │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  Clear localStorage│                    │                    │
     │  Clear sessionStorage                   │                    │
     │  Clear Cookies     │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │  resetKeycloak()   │                    │                    │
     │  Clear Keycloak    │                    │                    │
     │  Instance          │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  Redirect to /     │                    │                    │
     │  (Home Page)       │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │  GET /             │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  Fresh Page Load   │                    │                    │
     │  Not Authenticated │                    │                    │
     │  Show Login Button │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
     │                    │                    │                    │
┌────┴────────────────────────────────────────────────────────────────────────────┐
│ ALTERNATIVE: Server-Side Logout (Optional - Currently Client-Side Only)         │
└──────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │
     │  keycloak.logout() │                    │                    │
     │  (if enabled)      │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  Redirect to Keycloak Logout           │                    │
     │  /realms/myrealm/protocol/openid-connect/logout             │
     │  ?redirect_uri=http://localhost:3000   │                    │
     ├────────────────────────────────────────>│                    │
     │                    │                    │                    │
     │                    │  Invalidate Session│                    │
     │                    │  Clear SSO Cookies │                    │
     │                    │                    │                    │
     │  Redirect to App   │                    │                    │
     │  http://localhost:3000                 │                    │
     │<────────────────────────────────────────┤                    │
     │                    │                    │                    │
     │  GET /             │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │                    │                    │
     │  Fresh Page Load   │                    │                    │
     │  Not Authenticated │                    │                    │
     │<───────────────────┤                    │                    │
     │                    │                    │                    │
```

### Key Components and Their Roles

#### 1. **Browser (User's Web Browser)**

- Initiates all user actions (visiting site, clicking login/logout)
- Stores tokens in memory (via Keycloak.js)
- Handles redirects between app and Keycloak
- Executes JavaScript authentication logic

#### 2. **Next.js Web App (localhost:3000)**

- **AuthProvider.tsx**: React context managing authentication state
- **auth-simple.ts**: Keycloak client initialization and configuration
- **AuthButton.tsx**: UI component for login/logout actions
- **apollo.ts**: GraphQL client with automatic token attachment
- Handles PKCE code generation and verification
- Manages token storage and refresh

#### 3. **Keycloak SSO Server (localhost:8080)**

- **Realm**: `myrealm` - isolated authentication domain
- **Client**: `my-react-spa` - public client configuration
- Provides login/registration pages
- Issues JWT tokens (access, ID, refresh)
- Validates credentials against user database
- Manages SSO sessions across applications
- Provides JWKS endpoint for token verification

#### 4. **NestJS API (localhost:4000)**

- **KeycloakGuard**: JWT validation middleware
- Fetches public keys from Keycloak JWKS endpoint
- Verifies token signature, expiry, issuer, and audience
- Extracts user information from validated tokens
- Protects GraphQL resolvers with authentication
- Provides user context to business logic

### Authentication Flow Details

#### **Login Flow (Steps 1-4)**

1. **Initial Visit**: User visits app → AuthProvider checks for existing session
2. **Silent Check**: Attempts silent SSO check via iframe (may timeout, that's OK)
3. **Login Click**: User clicks "Login with Keycloak" button
4. **PKCE Generation**: App generates code_challenge for security
5. **Redirect to Keycloak**: Browser redirected to Keycloak login page
6. **User Authentication**: User enters credentials (testuser/password123)
7. **Authorization Code**: Keycloak validates and returns auth code
8. **Token Exchange**: App exchanges code for JWT tokens using PKCE verifier
9. **Store Tokens**: Tokens stored in memory, user marked as authenticated

#### **API Request Flow (Step 5)**

1. **User Action**: User creates/updates/deletes a todo
2. **GraphQL Request**: Apollo Client sends mutation with Bearer token
3. **Token Extraction**: NestJS extracts token from Authorization header
4. **JWKS Fetch**: API fetches Keycloak's public keys (cached)
5. **Token Validation**: Verifies signature, expiry, issuer, audience
6. **User Context**: Extracts user info (sub, username, roles) from token
7. **Execute Operation**: Resolver executes with authenticated user context
8. **Return Response**: Data returned to client, UI updated

#### **Token Refresh Flow (Step 6)**

1. **Timer Trigger**: Every 10 seconds, check if token needs refresh
2. **Refresh Request**: Send refresh_token to Keycloak
3. **New Tokens**: Receive new access_token and refresh_token
4. **Update Storage**: Replace old tokens with new ones
5. **Continue**: User session continues seamlessly

#### **Logout Flow (Step 7)**

**Current Implementation (Client-Side):**

1. **Logout Click**: User clicks logout button
2. **Clear State**: AuthProvider clears authentication state
3. **Clear Storage**: Remove all localStorage, sessionStorage, cookies
4. **Reset Keycloak**: Clear Keycloak instance to force fresh login
5. **Redirect Home**: Navigate to home page (unauthenticated)
6. **Fresh Start**: Next login will require credentials again

**Alternative (Server-Side - Optional):**

1. **Keycloak Logout**: Redirect to Keycloak logout endpoint
2. **Session Invalidation**: Keycloak clears SSO session
3. **Redirect Back**: Return to app with clean state

### Security Features

#### **PKCE (Proof Key for Code Exchange)**

- Protects against authorization code interception
- Code challenge sent with auth request
- Code verifier sent with token exchange
- Prevents replay attacks

#### **JWT Token Validation**

- **Signature**: Verified using Keycloak's public keys (RS256)
- **Expiry**: Checked against current time (exp claim)
- **Issuer**: Must match Keycloak realm URL
- **Audience**: Must match client ID (my-react-spa)
- **Claims**: User info extracted from validated token

#### **Token Lifecycle**

- **Access Token**: 5 minutes (300 seconds)
- **Refresh Token**: Used to get new access tokens
- **Automatic Refresh**: Every 10 seconds if token expires soon
- **Secure Storage**: Tokens kept in memory, not localStorage

### Environment Configuration

#### **Frontend (.env.local)**

```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=myrealm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=my-react-spa
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

#### **Backend (.env)**

```env
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENT_ID=my-react-spa
```

#### **Keycloak Client Settings**

- **Client Type**: Public (no client secret)
- **Standard Flow**: Enabled (Authorization Code)
- **Direct Access Grants**: Enabled
- **Implicit Flow**: Enabled (for silent check-sso)
- **Valid Redirect URIs**: `http://localhost:3000/*`
- **Web Origins**: `http://localhost:3000`
- **Post Logout Redirect URIs**: `http://localhost:3000/*`

### Common Scenarios

#### **First-Time User**

1. Visit app → See login button
2. Click login → Redirected to Keycloak
3. No account → Click "Register"
4. Fill registration form → Create account
5. Automatically logged in → Redirected to app
6. Can now use todo features

#### **Returning User**

1. Visit app → Silent SSO check
2. If session exists → Automatically authenticated
3. If no session → Show login button
4. Login with credentials → Access granted

#### **Multiple Tabs**

1. Login in Tab 1 → Authenticated
2. Open Tab 2 → Automatically authenticated (SSO)
3. Logout in Tab 1 → Tab 2 still shows authenticated (until refresh)
4. Refresh Tab 2 → Now unauthenticated

#### **Token Expiry**

1. Access token expires (5 minutes)
2. Automatic refresh triggered
3. New tokens obtained seamlessly
4. User continues working without interruption

### Troubleshooting Common Issues

#### **"Timeout when waiting for 3rd party check iframe message"**

- **Cause**: Silent SSO check timeout (normal behavior)
- **Impact**: None - app falls back to regular login
- **Solution**: No action needed, this is expected

#### **"Invalid redirect_uri"**

- **Cause**: Redirect URI mismatch in Keycloak client
- **Solution**: Ensure `http://localhost:3000/*` is in Valid Redirect URIs

#### **"401 Unauthorized" from API**

- **Cause**: Token validation failed
- **Check**: Token expiry, issuer, audience, JWKS endpoint accessibility
- **Solution**: Verify Keycloak is running and accessible from API container

#### **"CORS error"**

- **Cause**: Missing CORS configuration
- **Solution**: Ensure API allows origin `http://localhost:3000` with credentials

#### **Logout doesn't work**

- **Current**: Client-side logout clears local state only
- **Behavior**: Next login requires credentials (forced by `prompt: 'login'`)
- **Alternative**: Enable server-side logout for full SSO session termination

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

The project uses environment variables defined directly in the `docker-compose.yml` file for development. For production deployments, you can create separate `.env` files.

### Frontend Environment Variables (in docker-compose.yml)

```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=myrealm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=my-react-spa
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

### Backend Environment Variables (in docker-compose.yml)

```env
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENT_ID=my-react-spa
```

> **Note**: Environment variables are configured directly in `docker-compose.yml` for this development setup. For production, create separate `.env` files in each app directory.

---

## 🐳 Docker Commands

### Essential Commands

```bash
# Start all services in background
docker compose up -d

# Start with logs visible
docker compose up

# Stop all services
docker compose down

# Stop and remove volumes (reset all data)
docker compose down -v
```

### Development Workflow

```bash
# Start development environment
docker compose up -d

# View real-time logs
docker compose logs -f

# Restart specific service
docker compose restart api

# Rebuild after code changes
docker compose up --build api web

# Install new dependencies
docker compose exec api npm install
docker compose exec web npm install
```

### Monitoring & Debugging

```bash
# Check service status
docker compose ps

# View logs for specific service
docker compose logs -f keycloak
docker compose logs -f api
docker compose logs -f web
docker compose logs -f postgres

# Execute commands in containers
docker compose exec api bash
docker compose exec web sh

# View container resource usage
docker stats
```

### Complete Reset

#### Option 1: Using the Cleanup Script (Recommended)

```bash
# Run the comprehensive cleanup script
./cleanup.sh

# Start fresh after cleanup
docker compose up -d --build
```

#### Option 2: Manual Cleanup Commands

```bash
# Nuclear option - reset everything manually
docker compose down -v --rmi all
docker system prune -f
docker volume prune -f
docker network prune -f
docker compose up -d --build
```

#### Option 3: Step-by-Step Cleanup

```bash
# Stop and remove all services
docker compose down

# Remove containers and orphaned containers
docker compose down --remove-orphans

# Remove volumes (WARNING: This deletes all data)
docker compose down -v

# Remove all images created by this compose file
docker compose down --rmi all

# Clean up unused Docker resources
docker system prune -f

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

# Start fresh
docker compose up -d --build
```

### Production Commands

```bash
# Start in production mode
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker compose up -d --scale api=3

# Update specific service
docker compose pull api
docker compose up -d api
```

---

## 🧹 Cleanup & Reset

### Automated Cleanup Script

The project includes a comprehensive cleanup script (`cleanup.sh`) that removes all Docker resources created by this project:

```bash
# Make the script executable (first time only)
chmod +x cleanup.sh

# Run the cleanup script
./cleanup.sh
```

**What the cleanup script does:**

- ✅ Stops all running containers
- ✅ Removes all project containers
- ✅ Removes all project images
- ✅ Removes all project volumes (⚠️ **WARNING**: This deletes all data)
- ✅ Removes all project networks
- ✅ Cleans up unused Docker resources
- ✅ Provides colored output and progress feedback

### Manual Cleanup Commands

If you prefer to run cleanup commands manually:

```bash
# Complete cleanup in one command
docker compose down -v --rmi all --remove-orphans
docker system prune -f
docker volume prune -f
docker network prune -f

# Or step by step
docker compose down                    # Stop services
docker compose down --remove-orphans  # Remove containers
docker compose down -v                # Remove volumes
docker compose down --rmi all         # Remove images
docker system prune -f                # Clean unused resources
```

### When to Use Cleanup

Use the cleanup script when you want to:

- 🆕 Start completely fresh
- 🐛 Fix persistent issues
- 💾 Free up disk space
- 🔄 Reset to initial state
- 🧪 Test the setup process

> **⚠️ Warning**: The cleanup script removes ALL data including Keycloak configuration, user data, and any todos. Make sure to backup important data before running.

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
docker compose ps keycloak

# View Keycloak logs
docker compose logs keycloak

# Restart Keycloak if needed
docker compose restart keycloak
```

**Dependencies missing (TypeScript errors):**

```bash
# Install missing dependencies in API
cd apps/api
npm install

# Or rebuild the API container
docker compose up --build api
```

**Authentication not working:**

- **First**: Make sure Keycloak realm is configured (see setup instructions above)
- Verify redirect URIs match exactly: `http://localhost:3000/*`
- Check Web origins: `http://localhost:3000`
- Ensure client is public (not confidential)
- Check browser console for errors
- Verify environment variables are loaded

**"Realm does not exist" error:**

```bash
# Check if Keycloak is running
curl -s http://localhost:8080/realms/master/.well-known/openid_configuration

# If Keycloak is running but realm doesn't exist, run setup:
./setup-keycloak.sh

# Or follow manual setup guide:
# See MANUAL_KEYCLOAK_SETUP.md for detailed instructions
```

**"Timeout when waiting for 3rd party check iframe message" error:**

This is a common issue with Keycloak's silent check-sso. The application has been updated to handle this gracefully:

- The app will automatically fallback to regular login flow
- Authentication will still work, just without silent SSO
- This is normal behavior and doesn't affect functionality

**API returning 401 (Unauthorized):**

```bash
# Check API logs for token validation errors
docker compose logs api

# Verify Keycloak is accessible from API container
docker compose exec api curl http://keycloak:8080/realms/myrealm
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
docker compose ps

# View all logs
docker compose logs

# Check specific service
docker compose logs web
docker compose logs api
```

**Port conflicts (e.g., "port is already allocated"):**

```bash
# Check what's using a specific port
lsof -i :5432  # Check PostgreSQL port
lsof -i :8080  # Check Keycloak port
lsof -i :3000  # Check Next.js port
lsof -i :4000  # Check API port

# Stop conflicting containers
docker ps  # List running containers
docker stop <container-name>  # Stop the conflicting container

# Alternative: Use different ports in docker-compose.yml
# Change port mapping from '5432:5432' to '5433:5432'
```

### Reset Everything

#### Quick Reset (Recommended)

```bash
# Use the cleanup script for complete reset
./cleanup.sh

# Start fresh
docker compose up -d --build
```

#### Manual Reset

```bash
# Stop and remove all containers and volumes
docker compose down -v

# Remove images (optional - forces rebuild)
docker compose down --rmi all

# Start fresh
docker compose up -d --build
```

### Development Tips

```bash
# Start only specific services
docker compose up keycloak postgres

# Run API locally while using Docker Keycloak
cd apps/api && npm run start:dev

# View real-time logs
docker compose logs -f --tail=100

# Execute commands in running containers
docker compose exec api npm install
docker compose exec web npm run build
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

## 🔄 CI/CD Pipeline

This project includes a comprehensive GitHub Actions workflow that automatically:

### **Build & Test Pipeline**

- ✅ Tests on Node.js 18.x and 20.x
- ✅ Installs dependencies and builds both applications
- ✅ Runs linting and tests (if available)
- ✅ Performs security audits with npm audit

### **Docker Integration Testing**

- ✅ Validates docker-compose.yml configuration
- ✅ Builds all Docker images from scratch
- ✅ Starts the complete stack (Keycloak, API, Web, PostgreSQL)
- ✅ Tests service health endpoints
- ✅ Provides comprehensive logging for debugging

### **Security Scanning**

- ✅ Runs npm audit on both API and Web applications
- ✅ Checks for high-severity vulnerabilities
- ✅ Continues build even if vulnerabilities are found (for visibility)

The CI pipeline ensures code quality and deployment readiness on every push and pull request.

---

## 🌟 **Why This Project Stands Out**

### **Production-Ready Architecture**

- ✅ **Complete CI/CD pipeline** with automated testing and security scanning
- ✅ **Docker containerization** for consistent development and deployment
- ✅ **Enterprise-grade authentication** with Keycloak SSO integration
- ✅ **Comprehensive error handling** and logging throughout the stack

### **Educational Value**

- ✅ **Extensive documentation** with step-by-step setup guides
- ✅ **Clear separation of concerns** and modular architecture
- ✅ **Real-world authentication patterns** and security best practices
- ✅ **Modern development workflow** with hot reload and automated testing

### **Technical Excellence**

- ✅ **100% TypeScript** - Full type safety across frontend and backend
- ✅ **Modern frameworks** - Latest versions of Next.js and NestJS
- ✅ **Security-first approach** - JWT validation, CORS, and audit logging
- ✅ **Scalable patterns** - Ready for enterprise-level applications

### **Developer Experience**

- ✅ **One-command setup** - Complete environment with `docker compose up -d`
- ✅ **Hot reload development** - Instant feedback during development
- ✅ **Comprehensive troubleshooting** - Detailed error resolution guides
- ✅ **Professional documentation** - Clear, actionable instructions

---

## 📈 **Project Metrics**

| Metric                 | Status                 |
| ---------------------- | ---------------------- |
| **Type Safety**        | 100% TypeScript        |
| **Testing**            | Automated CI/CD        |
| **Security**           | Vulnerability Scanning |
| **Deployment**         | Docker Ready           |
| **Documentation**      | Comprehensive          |
| **Framework Versions** | Latest Stable          |

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

## 🤝 **Contributing**

This project welcomes contributions! Whether you're:

- 🐛 **Reporting bugs** or issues with authentication flow
- 💡 **Suggesting new features** for enhanced functionality
- 📝 **Improving documentation** and setup guides
- 🔧 **Submitting code improvements** and optimizations

Feel free to open issues or submit pull requests. All contributions help make this project better for the community!

---

## 📄 **License**

MIT License - Feel free to use this project as a foundation for your own applications or learning purposes. See the [LICENSE](LICENSE) file for details.

---

## ⭐ **Show Your Support**

If this project helped you learn modern authentication patterns or served as a foundation for your application, please consider:

- ⭐ **Starring this repository**
- 🍴 **Forking it** for your own projects
- 📢 **Sharing it** with other developers
- 💬 **Opening discussions** about authentication patterns

---

**Built with ❤️ to demonstrate enterprise-grade authentication in modern web applications**

_Perfect for learning, portfolio demonstration, and as a foundation for production applications_
