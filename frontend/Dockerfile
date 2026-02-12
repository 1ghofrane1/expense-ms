# Build
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# ✅ Injecte les variables au build
ARG VITE_EXPENSES_API_URL
ARG VITE_ANALYTICS_API_URL
ENV VITE_EXPENSES_API_URL=$VITE_EXPENSES_API_URL
ENV VITE_ANALYTICS_API_URL=$VITE_ANALYTICS_API_URL

RUN npm run build

# Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
