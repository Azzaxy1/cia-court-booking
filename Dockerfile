FROM oven/bun:1.2-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies (clear cache first)
RUN rm -rf node_modules bun.lock && bun install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Create non-root user for security (disabled for development)
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# Change ownership of app directory (disabled for development)  
# RUN chown -R nextjs:nodejs /app
# USER nextjs

# Expose port
EXPOSE 3000

# Set memory limits and optimization for Node.js
ENV NODE_OPTIONS="--max-old-space-size=3072 --max-http-header-size=32768"
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application
CMD ["bun", "run", "dev"]