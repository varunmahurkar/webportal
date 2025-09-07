#!/bin/bash

# ALEXIKA AI - Automated Docker Update Script
# Handles automatic updates with zero downtime and rollback capability

set -e  # Exit on any error

# Configuration
PROJECT_NAME="alexika-ai"
LOG_FILE="./logs/docker-update.log"
BACKUP_DIR="./backups"
MAX_BACKUPS=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Create necessary directories
create_directories() {
    mkdir -p "$(dirname "$LOG_FILE")"
    mkdir -p "$BACKUP_DIR"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_success "Docker is running"
}

# Check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose is not installed or not in PATH"
        exit 1
    fi
    log_success "Docker Compose is available"
}

# Backup current state
backup_current_state() {
    log "Creating backup of current state..."
    local backup_name="backup_$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    mkdir -p "$backup_path"
    
    # Export current container state
    docker-compose config > "$backup_path/docker-compose-current.yml"
    
    # Save current image IDs
    docker-compose images --quiet > "$backup_path/image-ids.txt"
    
    # Backup environment files
    if [ -f ".env" ]; then
        cp ".env" "$backup_path/"
    fi
    if [ -f ".env.production" ]; then
        cp ".env.production" "$backup_path/"
    fi
    
    log_success "Backup created at $backup_path"
    
    # Clean old backups (keep only MAX_BACKUPS)
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" | sort | head -n -$MAX_BACKUPS | xargs rm -rf
}

# Check for updates
check_for_updates() {
    log "Checking for image updates..."
    
    # Pull latest images
    if docker-compose pull; then
        log_success "Successfully pulled latest images"
        
        # Check if any images were updated
        if docker-compose images --quiet | diff - "$BACKUP_DIR"/*/image-ids.txt >/dev/null 2>&1; then
            log "No updates available"
            return 1
        else
            log_success "Updates available!"
            return 0
        fi
    else
        log_error "Failed to pull images"
        return 1
    fi
}

# Perform health check
health_check() {
    local service_name=$1
    local max_attempts=30
    local attempt=1
    
    log "Performing health check for $service_name..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T "$service_name" curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
            log_success "Health check passed for $service_name"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed, retrying..."
        sleep 10
        ((attempt++))
    done
    
    log_error "Health check failed for $service_name after $max_attempts attempts"
    return 1
}

# Rolling update with zero downtime
rolling_update() {
    log "Starting rolling update..."
    
    # Scale up with new version
    log "Scaling up with new version..."
    if ! docker-compose up -d --scale alexika-ai=2 --no-recreate; then
        log_error "Failed to scale up with new version"
        return 1
    fi
    
    # Wait for new instances to be healthy
    sleep 30
    
    # Check health of new instances
    local new_container_id=$(docker-compose ps -q alexika-ai | head -n 1)
    if ! docker exec "$new_container_id" curl -f http://localhost:3000 >/dev/null 2>&1; then
        log_error "New instance health check failed"
        rollback
        return 1
    fi
    
    # Scale down to remove old instances
    log "Scaling down old instances..."
    if ! docker-compose up -d --scale alexika-ai=1; then
        log_error "Failed to scale down"
        return 1
    fi
    
    log_success "Rolling update completed successfully"
}

# Simple update (with brief downtime)
simple_update() {
    log "Starting simple update (brief downtime)..."
    
    # Recreate containers with new images
    if docker-compose up -d --force-recreate; then
        log_success "Containers recreated successfully"
    else
        log_error "Failed to recreate containers"
        rollback
        return 1
    fi
    
    # Wait for service to be ready
    sleep 10
    
    # Perform health check
    if health_check "alexika-ai"; then
        log_success "Simple update completed successfully"
    else
        log_error "Health check failed after update"
        rollback
        return 1
    fi
}

# Rollback to previous version
rollback() {
    log_warning "Initiating rollback to previous version..."
    
    local latest_backup=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" | sort | tail -n 1)
    
    if [ -z "$latest_backup" ]; then
        log_error "No backup found for rollback"
        return 1
    fi
    
    log "Rolling back using backup: $latest_backup"
    
    # Restore from backup
    if [ -f "$latest_backup/docker-compose-current.yml" ]; then
        cp "$latest_backup/docker-compose-current.yml" "./docker-compose.yml"
    fi
    
    # Restore environment files
    if [ -f "$latest_backup/.env" ]; then
        cp "$latest_backup/.env" "./"
    fi
    if [ -f "$latest_backup/.env.production" ]; then
        cp "$latest_backup/.env.production" "./"
    fi
    
    # Recreate containers with previous configuration
    if docker-compose up -d --force-recreate; then
        log_success "Rollback completed successfully"
    else
        log_error "Rollback failed"
        return 1
    fi
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up unused images and containers..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused networks
    docker network prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    log_success "Cleanup completed"
}

# Main update process
main() {
    log "Starting ALEXIKA AI update process..."
    
    # Pre-flight checks
    create_directories
    check_docker
    check_docker_compose
    
    # Create backup
    backup_current_state
    
    # Check for updates
    if ! check_for_updates; then
        log "No updates needed. Exiting."
        exit 0
    fi
    
    # Perform update based on configuration
    local update_method=${UPDATE_METHOD:-"rolling"}
    
    case "$update_method" in
        "rolling")
            if rolling_update; then
                log_success "Rolling update completed successfully"
            else
                log_error "Rolling update failed"
                exit 1
            fi
            ;;
        "simple")
            if simple_update; then
                log_success "Simple update completed successfully"
            else
                log_error "Simple update failed"
                exit 1
            fi
            ;;
        *)
            log_error "Unknown update method: $update_method"
            exit 1
            ;;
    esac
    
    # Final health check
    if health_check "alexika-ai"; then
        log_success "Final health check passed"
    else
        log_error "Final health check failed"
        rollback
        exit 1
    fi
    
    # Cleanup
    cleanup
    
    log_success "ALEXIKA AI update process completed successfully!"
}

# Handle script arguments
case "${1:-}" in
    "--help" | "-h")
        echo "ALEXIKA AI Docker Update Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --check-only        Only check for updates, don't apply"
        echo "  --force             Force update even if no changes detected"
        echo "  --rollback          Rollback to previous version"
        echo "  --cleanup-only      Only perform cleanup"
        echo ""
        echo "Environment Variables:"
        echo "  UPDATE_METHOD       Update method: 'rolling' (default) or 'simple'"
        echo "  SKIP_BACKUP         Skip backup creation (not recommended)"
        echo ""
        exit 0
        ;;
    "--check-only")
        create_directories
        check_docker
        check_docker_compose
        if check_for_updates; then
            echo "Updates available!"
            exit 0
        else
            echo "No updates available."
            exit 1
        fi
        ;;
    "--rollback")
        create_directories
        check_docker
        check_docker_compose
        rollback
        exit $?
        ;;
    "--cleanup-only")
        check_docker
        cleanup
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac