# syntax=docker/dockerfile:1.4

# ========================
# Dependencies stage
# ========================
FROM node:20-slim AS deps

# Устанавливаем зависимости
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Устанавливаем зависимости с правильной переустановкой sharp
RUN \
  if [ -f yarn.lock ]; then \
    yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci --include=optional && \
    npm uninstall sharp && \
    npm install --os=linux --cpu=x64 sharp; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# ========================
# Build stage
# ========================
FROM node:20-slim AS builder

# Устанавливаем зависимости для сборки
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем node_modules из deps
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Сборка приложения
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else npm run build; \
  fi

# ========================
# Production stage
# ========================
FROM node:20-slim AS runner

# Устанавливаем runtime зависимости
RUN apt-get update && apt-get install -y \
    dumb-init \
    curl \
    ca-certificates \
    tzdata \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

# Создаем непривилегированного пользователя
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

WORKDIR /app

# Устанавливаем правильные разрешения
RUN mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# Копируем public директорию
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Копируем standalone сборку
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Копируем статические файлы
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на непривилегированного пользователя
USER nextjs

# Открываем порт
EXPOSE 3000

# Переменные окружения для production
ENV PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Метаданные
LABEL maintainer="your-email@example.com" \
      description="Next.js Production Application" \
      version="1.0"

# Используем dumb-init для правильной обработки сигналов
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Запускаем сервер
CMD ["node", "server.js"]