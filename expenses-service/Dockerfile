FROM node:18-alpine

WORKDIR /app

# Dépendances
COPY package*.json ./
RUN npm ci

# Code
COPY . .

EXPOSE 3001

# Bonnes pratiques
ENV NODE_ENV=production

CMD ["npm", "start"]
