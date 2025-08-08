# Use official Node.js Alpine image for small size
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package.json yarn.lock package-lock.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy rest of the source code
COPY . .

# Build Prisma client and compile TypeScript
RUN yarn build

# Expose your app port (optional, if your app listens on 8080)
EXPOSE 8080

# Run migrations then start app
CMD ["sh", "-c", "yarn migrate-dep && yarn start"]