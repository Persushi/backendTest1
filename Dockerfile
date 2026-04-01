# ── Stage 1: dependencies ────────────────────────────────────────────────────
# Instala solo las dependencias de producción y las de build.
# Esta capa se cachea mientras package*.json no cambie.
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# ── Stage 2: build ────────────────────────────────────────────────────────────
# Compila el proyecto. Reutiliza node_modules del stage anterior.
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# ── Stage 3: production ───────────────────────────────────────────────────────
# Imagen final mínima: solo el dist y las dependencias de producción.
FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
