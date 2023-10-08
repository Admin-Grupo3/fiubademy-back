FROM node:18-alpine AS development

ENV NODE_ENV=development
WORKDIR /app

COPY package*.json .npmrc ./

RUN npm install --package-lock-only
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json .npmrc ./

RUN npm install --package-lock-only
RUN npm ci
COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]