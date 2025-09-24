# Contributing to Next.js + NestJS Todo App with Keycloak SSO

Thank you for your interest in contributing! This project demonstrates modern authentication patterns with Keycloak SSO.

## Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/votoznotna/next-nest-todo-keycloak.git
cd next-nest-todo-keycloak

# Start the complete stack
docker-compose up -d

# Or run locally
cd apps/api && npm install && npm run start:dev
cd apps/web && npm install && npm run dev
```

## Project Structure

- `apps/web/` - Next.js frontend with Keycloak integration
- `apps/api/` - NestJS GraphQL API with JWT validation
- `docker-compose.yml` - Complete development stack

## Making Changes

### Frontend (Next.js)

- Authentication logic in `apps/web/lib/auth.ts`
- Components in `apps/web/components/`
- Pages in `apps/web/app/`

### Backend (NestJS)

- Authentication guard in `apps/api/src/auth/keycloak.guard.ts`
- GraphQL resolvers in `apps/api/src/todo/`

### Testing Changes

```bash
# Test the complete flow
docker-compose up -d
# Visit http://localhost:3000
# Configure Keycloak (see README)
# Test authentication and todo operations
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test with Docker Compose
5. Commit with clear messages
6. Push to your fork
7. Submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow existing patterns for authentication
- Add comments for complex authentication logic
- Update README if adding new features

## Issues

- Use GitHub Issues for bug reports
- Include steps to reproduce
- Mention your environment (Docker/local)
- Include relevant logs

## Questions?

Feel free to open an issue for questions about:

- Keycloak configuration
- Authentication patterns
- Docker setup
- GraphQL implementation
