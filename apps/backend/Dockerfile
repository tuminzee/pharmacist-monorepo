# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY package.json  ./

# Install dependencies
RUN pnpm install

# Copy the application code excluding .env files
COPY . .
RUN rm -f .env .env.* *.env *.env.*

# Build the application
RUN pnpm run build

# Stage 2: Run the application
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 8080

# Updated command to use pnpm
CMD ["pnpm", "run", "start:prod"]
