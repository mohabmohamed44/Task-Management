# Docker & Jenkins Setup Guide

## Docker Files Overview

This project includes the following Docker-related files:

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development environment with hot reload
- `docker-compose.yml` - Orchestration for different environments
- `.dockerignore` - Files to exclude from Docker builds
- `nginx.conf` - Nginx configuration for production

## Quick Start

### Development Mode

```bash
# Run development server with hot reload
docker-compose --profile dev up

# Access the app at http://localhost:5173
```

### Production Build

```bash
# Build and run production version
docker-compose --profile prod up

# Access the app at http://localhost:8080
```

### Run Tests

```bash
# Run tests in Docker
docker-compose --profile test up
```

## Manual Docker Commands

### Build Production Image

```bash
docker build -t task-management-app:latest .
```

### Run Production Container

```bash
docker run -p 8080:80 task-management-app:latest
```

### Build Development Image

```bash
docker build -f Dockerfile.dev -t task-management-app:dev .
```

### Run Development Container

```bash
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules task-management-app:dev
```

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

Pass environment variables to Docker:

```bash
docker run --env-file .env -p 8080:80 task-management-app:latest
```

## Jenkins Pipeline

### Prerequisites

1. **Jenkins Setup**:
   - Install NodeJS plugin
   - Configure Node.js installation (Node 20)
   - Install Docker Pipeline plugin
   - Set up Docker credentials

2. **Configure Credentials**:
   - Add Docker registry credentials with ID: `docker-credentials-id`
   - Set up any deployment credentials (AWS, Kubernetes, etc.)

3. **Update Jenkinsfile**:
   - Set `DOCKER_REGISTRY` environment variable
   - Configure deployment commands for your infrastructure

### Pipeline Stages

1. **Checkout** - Pulls code from SCM
2. **Setup Node.js** - Configures Node.js environment
3. **Install Dependencies** - Runs `npm ci`
4. **Lint** - Runs ESLint
5. **Test** - Runs test suite
6. **Build Application** - Builds production assets
7. **Build Docker Image** - Creates Docker image
8. **Push Docker Image** - Pushes to registry (main branch only)
9. **Deploy to Staging** - Deploys develop branch
10. **Deploy to Production** - Deploys main branch

### Trigger Pipeline

The pipeline automatically triggers on:
- Push to any branch
- Pull request events

### Branch Strategy

- `develop` → Staging deployment
- `main` → Production deployment
- Other branches → Build and test only

## Health Checks

The production container includes a health check endpoint:

```bash
curl http://localhost:8080/health
```

## Optimization Tips

1. **Multi-stage builds** reduce image size
2. **Nginx** serves static files efficiently
3. **Gzip compression** enabled by default
4. **Cache headers** set for static assets
5. **Security headers** included in nginx config

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs <container_id>

# Check if port is in use
lsof -i :8080
```

### Build fails

```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t task-management-app:latest .
```

### Permission issues

```bash
# Fix node_modules permissions
docker-compose --profile dev run --rm app-dev chown -R node:node /app/node_modules
```

## Production Deployment

### Using Docker Hub

```bash
# Tag image
docker tag task-management-app:latest username/task-management-app:latest

# Push to Docker Hub
docker push username/task-management-app:latest

# Pull and run on production server
docker pull username/task-management-app:latest
docker run -d -p 80:80 username/task-management-app:latest
```

### Using Kubernetes

Create deployment manifests in `k8s/` directory and update Jenkins pipeline accordingly.

### Using AWS ECS

Configure ECS task definitions and update Jenkins pipeline with AWS CLI commands.
