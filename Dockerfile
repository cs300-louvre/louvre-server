# FROM node:12.17.0-alpine
# WORKDIR /usr
# COPY package.json ./
# RUN npm install --only=production
# COPY --from=0 /usr/dist .
# RUN npm install pm2 -g
# EXPOSE 80
# CMD ["pm2-runtime","app.js"]
FROM node:16.15.1-slim AS builder
WORKDIR /app
COPY . .
RUN ls -a
RUN npm install
RUN npm run build

FROM node:16.15.1-slim AS runner
WORKDIR /app
COPY package.json ./
RUN npm install
COPY --from=builder /app/build .
COPY --from=builder /app/.env .
RUN npm install pm2 -g
EXPOSE 80
CMD ["pm2-runtime","server.js"]