# SIT725 Applied Software Engineering - Client-Side Project Docker Implementation
# Student: Thoran Kumar Cherukuru Ramesh (s224967779)
# Multi-stage production-ready build for Globe Visualization Project

# Build stage
FROM node:18-alpine as builder

# Metadata labels for professional documentation
LABEL maintainer="Thoran Kumar Cherukuru Ramesh <s224967779@deakin.edu.au>"
LABEL version="1.0.0"
LABEL description="SIT725 Globe Visualization - Dockerized Client-Side Application"
LABEL assignment="8.3HD Docker Implementation"
LABEL project.type="Client-side with Express server"

# Set working directory
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Production stage
FROM node:18-alpine as production

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy package files with proper ownership
COPY --chown=nodeuser:nodejs package*.json ./

# Copy server file
COPY --chown=nodeuser:nodejs server.js ./

# Copy all your existing client-side files
COPY --chown=nodeuser:nodejs index.html ./
COPY --chown=nodeuser:nodejs login.html ./
COPY --chown=nodeuser:nodejs support.html ./
COPY --chown=nodeuser:nodejs styles.css ./
COPY --chown=nodeuser:nodejs globe.js ./

# Create logs directory with proper permissions
RUN mkdir -p /usr/src/app/logs && \
    chown -R nodeuser:nodejs /usr/src/app && \
    chmod -R 755 /usr/src/app

# Switch to non-root user
USER nodeuser

# Expose application port
EXPOSE 3000

# Add health check for container monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start application with proper signal handling
CMD ["node", "server.js"]