# 🐳 ALEXIKA AI - Docker Documentation

Complete guide for containerizing and running the ALEXIKA AI platform with Docker.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Docker Configuration](#-docker-configuration)
- [Development Setup](#-development-setup)
- [Production Deployment](#-production-deployment)
- [Auto-Update Setup](#-auto-update-setup)
- [Common Commands](#-common-commands)
- [Troubleshooting](#-troubleshooting)
- [Performance Optimization](#-performance-optimization)

---

## 🚀 Quick Start

### For Development
```bash
# Clone and setup the project
git clone <repository-url>
cd alexika

# Start development environment
docker-compose --profile dev up -d

# Access the application
open http://localhost:3001
```

### For Production
```bash
# Build and start production environment
docker-compose up -d

# Access the application
open http://localhost:3000
```

---

## 📋 Prerequisites

### Required Software
- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ ([Install Compose](https://docs.docker.com/compose/install/))
- **Git**: For cloning repository

### System Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 10GB free space
- **OS**: Windows 10/11, macOS 10.14+, or Linux

### Verify Installation
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker installation
docker run hello-world
```

---

## 🐳 Docker Configuration

### File Structure
```
alexika/
├── Dockerfile              # Production container
├── Dockerfile.dev         # Development container
├── docker-compose.yml     # Multi-environment setup
├── .dockerignore          # Build context exclusions
├── docker.md              # This documentation
└── scripts/
    ├── docker-update.sh    # Auto-update script
    └── docker-health.sh    # Health check script
```

### Container Architecture

#### Production Container (`Dockerfile`)
- **Base Image**: `node:18-alpine` (Multi-stage build)
- **Size**: ~150MB (optimized)
- **Security**: Non-root user, minimal attack surface
- **Features**: Health checks, proper caching layers

#### Development Container (`Dockerfile.dev`)
- **Base Image**: `node:18-alpine`
- **Features**: Hot reload, debugging tools, full dev dependencies
- **Volumes**: Source code mounted for instant changes

---

## 🛠️ Development Setup

### Start Development Environment
```bash
# Start with hot reload and debugging
docker-compose --profile dev up -d

# View logs
docker-compose logs -f alexika-dev

# Stop development environment
docker-compose --profile dev down
```

### Development Features
- ✅ **Hot Reload**: Instant code changes
- ✅ **Source Maps**: Full debugging support
- ✅ **Volume Mounting**: Real-time file sync
- ✅ **Port Mapping**: `localhost:3001`

### Development Commands
```bash
# Rebuild development container
docker-compose --profile dev up --build -d

# Execute commands in development container
docker-compose exec alexika-dev npm run lint
docker-compose exec alexika-dev npm run test

# Access container shell
docker-compose exec alexika-dev sh

# View real-time logs
docker-compose --profile dev logs -f
```

---

## 🚀 Production Deployment

### Basic Production Setup
```bash
# Build and start production containers
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs alexika-ai
```

### Production with Nginx (Recommended)
```bash
# Start with reverse proxy
docker-compose --profile production up -d

# This starts:
# - ALEXIKA AI app (port 3000)
# - Nginx reverse proxy (ports 80/443)
```

### Production Features
- ✅ **Multi-stage Build**: Optimized image size
- ✅ **Security**: Non-root user, minimal dependencies
- ✅ **Health Checks**: Automatic container monitoring
- ✅ **Restart Policies**: Automatic recovery
- ✅ **Resource Limits**: Memory and CPU constraints

### Environment Variables
```bash
# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
# Add your custom variables here
EOF
```

---

## 🔄 Auto-Update Setup

### Enable Watchtower (Automatic Updates)
```bash
# Start with auto-update capability
docker-compose --profile auto-update up -d

# This monitors and updates containers automatically
```

### Manual Update Process
```bash
# Pull latest images
docker-compose pull

# Recreate containers with new images
docker-compose up -d

# Clean up old images
docker image prune -f
```

### Update Scripts
```bash
# Make update script executable
chmod +x scripts/docker-update.sh

# Run automated update
./scripts/docker-update.sh

# Schedule with cron (every 6 hours)
echo "0 */6 * * * /path/to/alexika/scripts/docker-update.sh" | crontab -
```

---

## 📝 Common Commands

### Container Management
```bash
# View running containers
docker-compose ps

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart alexika-ai

# View service logs
docker-compose logs -f alexika-ai

# Scale services (if needed)
docker-compose up -d --scale alexika-ai=3
```

### Image Management
```bash
# Build images
docker-compose build

# Force rebuild (no cache)
docker-compose build --no-cache

# Pull latest images
docker-compose pull

# List images
docker images

# Remove unused images
docker image prune -f
```

### Debugging Commands
```bash
# Execute shell in running container
docker-compose exec alexika-ai sh

# Run one-off commands
docker-compose run --rm alexika-ai npm run test

# Copy files from container
docker cp alexika-ai-app:/app/logs ./local-logs

# Inspect container configuration
docker inspect alexika-ai-app
```

### Health Check Commands
```bash
# Check container health
docker-compose exec alexika-ai curl -f http://localhost:3000/api/health

# View health status
docker inspect --format='{{.State.Health.Status}}' alexika-ai-app

# Monitor resource usage
docker stats alexika-ai-app
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
docker-compose -f docker-compose.yml up -d -p 3001:3000
```

#### Build Failures
```bash
# Clear build cache
docker builder prune -f

# Rebuild without cache
docker-compose build --no-cache

# Check build logs
docker-compose build --progress=plain
```

#### Container Won't Start
```bash
# Check logs
docker-compose logs alexika-ai

# Inspect container
docker inspect alexika-ai-app

# Try interactive mode
docker-compose run --rm alexika-ai sh
```

#### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check container limits
docker inspect alexika-ai-app | grep -i memory

# Optimize with resource limits
```

### Debug Mode
```bash
# Start in debug mode
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up -d

# Enable debug logging
export DOCKER_BUILDKIT_INLINE_CACHE=1
export BUILDKIT_PROGRESS=plain
```

---

## ⚡ Performance Optimization

### Image Optimization
```bash
# Use multi-stage builds (already implemented)
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Use .dockerignore to reduce build context
# Cache node_modules between builds
```

### Runtime Optimization
```yaml
# Add to docker-compose.yml
services:
  alexika-ai:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

### Network Optimization
```bash
# Use Docker networks for service communication
# Enable HTTP/2 in Nginx configuration
# Implement CDN for static assets
```

### Monitoring Setup
```bash
# Add monitoring stack
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# This includes:
# - Prometheus for metrics
# - Grafana for visualization
# - cAdvisor for container metrics
```

---

## 🔒 Security Best Practices

### Container Security
- ✅ **Non-root User**: Containers run as non-privileged user
- ✅ **Minimal Base Image**: Alpine Linux for smaller attack surface  
- ✅ **No Secrets in Images**: Environment variables for configuration
- ✅ **Regular Updates**: Automated security updates with Watchtower

### Network Security
```bash
# Use custom networks
# Enable TLS/SSL termination at Nginx
# Implement rate limiting
# Add firewall rules for exposed ports
```

### Production Checklist
- [ ] Change default passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Enable automatic security updates
- [ ] Regular security scans

---

## 📊 Monitoring and Logging

### Health Checks
```bash
# Built-in health check endpoint
curl http://localhost:3000/api/health

# Docker health status
docker inspect --format='{{.State.Health.Status}}' alexika-ai-app
```

### Log Management
```bash
# View application logs
docker-compose logs -f alexika-ai

# Export logs to file
docker-compose logs alexika-ai > app.log

# Rotate logs automatically
docker-compose config | grep -A 5 logging:
```

### Metrics Collection
```bash
# Container metrics
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Application metrics (if implemented)
curl http://localhost:3000/api/metrics
```

---

## 🚀 Deployment Strategies

### Blue-Green Deployment
```bash
# Start new version (green)
docker-compose -f docker-compose.green.yml up -d

# Test green environment
curl -H "Host: green.alexika.local" http://localhost

# Switch traffic (update nginx config)
# Stop old version (blue)
docker-compose -f docker-compose.blue.yml down
```

### Rolling Updates
```bash
# Update with zero downtime
docker-compose up -d --scale alexika-ai=2
# Health check new instances
# Remove old instances
docker-compose up -d --scale alexika-ai=1
```

---

## 📚 Additional Resources

### Docker Documentation
- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)

### ALEXIKA AI Specific
- [Architecture Documentation](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Contributing Guide](./docs/contributing.md)

### Support
- **Issues**: [GitHub Issues](https://github.com/your-org/alexika-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/alexika-ai/discussions)
- **Documentation**: [Full Documentation](./docs/)

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-XX | Initial Docker implementation |
| 1.1.0 | 2024-01-XX | Added auto-update capabilities |
| 1.2.0 | 2024-01-XX | Enhanced security and monitoring |

---

**🎉 Congratulations!** You now have a fully containerized ALEXIKA AI platform with automatic updates and comprehensive monitoring. For additional help, please refer to the troubleshooting section or open an issue on GitHub.