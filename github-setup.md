# GitHub Repository Setup

Follow these steps to push your project to GitHub:

## 1. Create Repository on GitHub

1. Go to https://github.com/votoznotna
2. Click "New repository"
3. Repository name: `next-nest-todo-keycloak`
4. Description: `Full-stack Todo application with Next.js, NestJS, and Keycloak SSO authentication`
5. Make it **Public** (to showcase your work)
6. **Don't** initialize with README, .gitignore, or license (we already have them)
7. Click "Create repository"

## 2. Initialize Git and Push

Run these commands in your project directory:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Next.js + NestJS Todo App with Keycloak SSO

- Complete Docker Compose setup with Keycloak, API, Web, and PostgreSQL
- Next.js frontend with Keycloak authentication integration
- NestJS GraphQL API with JWT token validation
- Comprehensive documentation and setup guides
- Production-ready authentication flow with SSO support"

# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/votoznotna/next-nest-todo-keycloak.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Set Repository Topics

After pushing, go to your repository on GitHub and add these topics:

- `nextjs`
- `nestjs`
- `keycloak`
- `sso`
- `authentication`
- `graphql`
- `typescript`
- `docker`
- `jwt`
- `oauth2`
- `oidc`
- `full-stack`

## 4. Enable GitHub Pages (Optional)

If you want to host documentation:

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / docs (if you create a docs folder)

## 5. Repository Settings

Consider enabling:

- **Issues** - for bug reports and feature requests
- **Discussions** - for community questions
- **Security** - for vulnerability reporting

## 6. Add Repository Description

In your repository settings, add:

- **Description**: "Full-stack Todo application demonstrating modern authentication with Next.js, NestJS, and Keycloak SSO"
- **Website**: Your deployed app URL (if you deploy it)
- **Topics**: The keywords listed above

## 7. Create Additional Branches (Optional)

```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Create feature branch example
git checkout -b feature/enhanced-ui
git push -u origin feature/enhanced-ui
```

## 8. Set Up Branch Protection (Recommended)

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

Your repository will be live at:
**https://github.com/votoznotna/next-nest-todo-keycloak**
