# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Copy configuration files first to leverage Docker cache
COPY package.json package-lock.json ./
COPY .env* ./
COPY tsconfig.json ./  

# Install dependencies including optional dependencies
RUN npm ci --omit=dev --include=optional

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/tsconfig.json ./

# Copy ALL source files with proper case sensitivity
COPY src ./src
COPY public ./public
COPY package*.json ./
COPY next.config.* ./
COPY tsconfig.json ./
COPY .env* ./

# Verify copied files
RUN ls -lR src/components/ && \
    ls -lR src/utils/ && \
    ls -lR src/app/

# Then proceed with build
RUN npm run build

# Stage 3: Serve the application
FROM node:20-slim AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Install only production dependencies
RUN npm install --omit=dev --include=optional

# Expose the port the app runs on
ENV PORT=3002
EXPOSE 3002

# Switch to non-root user
USER nextjs

# Start the Next.js application
CMD ["npm", "start"]