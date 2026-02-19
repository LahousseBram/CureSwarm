FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY backend/package.json ./backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy all source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/stats', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
  }).on('error', () => process.exit(1))"

# Start server
CMD ["node", "backend/server.js"]