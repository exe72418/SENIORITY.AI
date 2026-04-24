FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY web-ui/package*.json ./
RUN npm install

# Copy source
COPY web-ui/ .

# Build for production
RUN npm run build

# Expose Next.js port
EXPOSE 3000

CMD ["npm", "start"]
