FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3002
ENV NODE_ENV=production

CMD ["npm", "start"]
