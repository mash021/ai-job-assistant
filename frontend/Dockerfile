# ---- Frontend image: Next.js ----
# For Epic 1 we use a single-stage image running the Next.js dev server.
# It is simple, supports hot-reload, and is ideal for local development.
# (A multi-stage production build using `output: standalone` can be added in
#  the deployment epic.)
FROM node:20-alpine

WORKDIR /app

# Install dependencies first so this layer is cached unless package files change.
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application source.
COPY . .

# Next.js dev server listens on port 3000.
EXPOSE 3000

# Start the dev server, bound to 0.0.0.0 so it is reachable from the host.
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
