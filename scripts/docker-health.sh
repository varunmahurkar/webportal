#!/bin/bash

# ALEXIKA AI - Health Check and Monitoring Script
# Comprehensive health monitoring for Docker containers

set -e

# Configuration
PROJECT_NAME="alexika-ai"
LOG_FILE="./logs/health-check.log"
ALERT_WEBHOOK=${ALERT_WEBHOOK:-""}  # Optional webhook for alerts

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

# Send alert (if webhook configured)
send_alert() {
    local message=$1
    local severity=${2:-"warning"}
    
    if [ -n "$ALERT_WEBHOOK" ]; then
        curl -X POST "$ALERT_WEBHOOK" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"ALEXIKA AI Alert [$severity]: $message\"}" \
             >/dev/null 2>&1 || true
    fi
    
    log_error "ALERT: $message"
}

# Check if Docker is running
check_docker_daemon() {
    if ! docker info >/dev/null 2>&1; then
        send_alert "Docker daemon is not running" "critical"
        return 1
    fi
    return 0
}

# Check container health
check_container_health() {
    local container_name=$1
    
    # Check if container exists and is running
    if ! docker-compose ps "$container_name" | grep -q "Up"; then
        send_alert "Container $container_name is not running"
        return 1
    fi
    
    # Check Docker health status
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' "${PROJECT_NAME}_${container_name}_1" 2>/dev/null || echo "unknown")
    
    case "$health_status" in
        "healthy")
            log_success "Container $container_name is healthy"
            return 0
            ;;
        "unhealthy")
            send_alert "Container $container_name is unhealthy"
            return 1
            ;;
        "starting")
            log_warning "Container $container_name is still starting"
            return 2
            ;;
        *)
            log_warning "Container $container_name health status unknown"
            return 2
            ;;
    esac
}

# Check application endpoints
check_app_endpoints() {
    local base_url=${1:-"http://localhost:3000"}
    
    log "Checking application endpoints..."
    
    # Main application endpoint
    if curl -f -s "$base_url" >/dev/null; then
        log_success "Main application endpoint is responding"
    else
        send_alert "Main application endpoint is not responding"
        return 1
    fi
    
    # Health check endpoint (if exists)
    if curl -f -s "$base_url/api/health" >/dev/null; then
        log_success "Health check endpoint is responding"
    else
        log_warning "Health check endpoint not available (this may be normal)"
    fi
    
    # API endpoint (if exists)
    if curl -f -s "$base_url/api" >/dev/null; then
        log_success "API endpoint is responding"
    else
        log_warning "API endpoint not available (this may be normal)"
    fi
    
    return 0
}

# Check resource usage
check_resource_usage() {
    log "Checking resource usage..."
    
    # Get container stats
    local stats=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep alexika || true)
    
    if [ -n "$stats" ]; then
        echo "$stats" | while read -r line; do
            if [ "$line" = "CONTAINER CPU % MEM USAGE / LIMIT MEM %" ]; then
                continue
            fi
            
            local container=$(echo "$line" | awk '{print $1}')
            local cpu_perc=$(echo "$line" | awk '{print $2}' | sed 's/%//')
            local mem_perc=$(echo "$line" | awk '{print $4}' | sed 's/%//')
            
            log "Resource usage for $container: CPU ${cpu_perc}%, Memory ${mem_perc}%"
            
            # Alert on high resource usage
            if (( $(echo "$cpu_perc > 90" | bc -l) )); then
                send_alert "High CPU usage detected for $container: ${cpu_perc}%"
            fi
            
            if (( $(echo "$mem_perc > 90" | bc -l) )); then
                send_alert "High memory usage detected for $container: ${mem_perc}%"
            fi
        done
    fi
}

# Check disk space
check_disk_space() {
    log "Checking disk space..."
    
    local disk_usage=$(df -h . | tail -n 1 | awk '{print $5}' | sed 's/%//')
    
    log "Disk usage: ${disk_usage}%"
    
    if [ "$disk_usage" -gt 90 ]; then
        send_alert "High disk usage detected: ${disk_usage}%"
    elif [ "$disk_usage" -gt 80 ]; then
        log_warning "Disk usage is getting high: ${disk_usage}%"
    fi
}

# Check Docker system health
check_docker_system() {
    log "Checking Docker system health..."
    
    # Check for failed containers
    local failed_containers=$(docker ps -a --filter "status=exited" --filter "status=dead" --format "{{.Names}}" | grep alexika || true)
    
    if [ -n "$failed_containers" ]; then
        send_alert "Failed containers detected: $failed_containers"
    fi
    
    # Check Docker daemon health
    local docker_events=$(timeout 5 docker events --since 1m --filter type=daemon 2>/dev/null || true)
    if echo "$docker_events" | grep -q "die\|kill\|oom"; then
        send_alert "Docker daemon issues detected in recent events"
    fi
}

# Generate health report
generate_health_report() {
    log "Generating health report..."
    
    local report_file="./logs/health-report-$(date +%Y%m%d_%H%M%S).json"
    
    {
        echo "{"
        echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
        echo "  \"project\": \"$PROJECT_NAME\","
        echo "  \"status\": \"healthy\","
        echo "  \"containers\": {"
        
        # Container status
        docker-compose ps --format json | jq -r '.[] | "    \"" + .Service + "\": { \"status\": \"" + .State + "\", \"health\": \"" + (.Health // "unknown") + "\" },"' | sed '$ s/,$//'
        
        echo "  },"
        echo "  \"resources\": {"
        
        # Resource usage
        docker stats --no-stream --format json | grep alexika | head -1 | jq -r '
            "    \"cpu_percent\": \"" + .CPUPerc + "\","
            "    \"memory_usage\": \"" + .MemUsage + "\","
            "    \"memory_percent\": \"" + .MemPerc + "\""
        '
        
        echo "  },"
        echo "  \"disk_usage\": \"$(df -h . | tail -n 1 | awk '{print $5}')\""
        echo "}"
    } > "$report_file"
    
    log_success "Health report generated: $report_file"
}

# Main health check
main() {
    mkdir -p "$(dirname "$LOG_FILE")"
    mkdir -p "./logs"
    
    log "Starting ALEXIKA AI health check..."
    
    local overall_status=0
    
    # Check Docker daemon
    if ! check_docker_daemon; then
        overall_status=1
    fi
    
    # Check main application container
    case $(check_container_health "alexika-ai") in
        1) overall_status=1 ;;
        2) log_warning "Container is in transitional state" ;;
    esac
    
    # Check application endpoints
    if ! check_app_endpoints; then
        overall_status=1
    fi
    
    # Check resource usage
    check_resource_usage
    
    # Check disk space
    check_disk_space
    
    # Check Docker system
    check_docker_system
    
    # Generate report
    generate_health_report
    
    if [ $overall_status -eq 0 ]; then
        log_success "Overall health check: HEALTHY"
        exit 0
    else
        log_error "Overall health check: UNHEALTHY"
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "--help" | "-h")
        echo "ALEXIKA AI Health Check Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --container NAME    Check specific container only"
        echo "  --endpoints-only    Check only application endpoints"
        echo "  --resources-only    Check only resource usage"
        echo "  --report-only       Generate health report only"
        echo ""
        echo "Environment Variables:"
        echo "  ALERT_WEBHOOK       Webhook URL for sending alerts"
        echo ""
        exit 0
        ;;
    "--container")
        shift
        check_container_health "$1"
        exit $?
        ;;
    "--endpoints-only")
        check_app_endpoints
        exit $?
        ;;
    "--resources-only")
        check_resource_usage
        exit 0
        ;;
    "--report-only")
        mkdir -p "./logs"
        generate_health_report
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