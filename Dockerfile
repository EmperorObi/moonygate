# Stage 1: Builder
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json or yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code including the .next folder after the build
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the application will run on
EXPOSE 3000

# Command to start the Next.js production server
CMD ["npm", "start"]
