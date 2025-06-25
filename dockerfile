FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app

COPY --chown=nonroot:nonroot --from=builder /app/dist ./dist
COPY --chown=nonroot:nonroot --from=builder /app/node_modules ./node_modules
COPY --chown=nonroot:nonroot --from=builder /app/package.json ./package.json

USER nonroot

EXPOSE 3000

CMD ["dist/main.js"]
