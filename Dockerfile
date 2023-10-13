# 
# Base Stage
# 
FROM node:20-alpine as base
RUN npm i -g pnpm

# 
# Dependencies Install Stage
# 
FROM base as dependencies
WORKDIR /app
COPY package.json ./
RUN pnpm i

# 
# Build Stage
# 
FROM base as build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build
RUN pnpm prune --prod

# 
# Development Stage
# 
FROM base as development
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
CMD ["pnpm", "run", "start:dev"]

# 
# Run Stage
# 
FROM base as deploy
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules
CMD [ "node", "dist/main.js" ]