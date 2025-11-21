# ========================
# Build stage
# ========================
FROM node:20.11.1-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ========================
# Production stage
# ========================
FROM node:20.11.1-alpine AS production

WORKDIR /app
COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
