# -------- Stage 1: Build client --------
FROM node:20-alpine AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# -------- Stage 2: Final container --------
FROM node:20-alpine
WORKDIR /app

# Встановлення серверних залежностей
COPY server/package*.json ./server/
RUN cd server && npm install

# Копіюємо серверний код
COPY server ./server

# Копіюємо зібраний фронт з client-build у сервер
COPY --from=client-build /client/dist ./server/src/dist

# Копіюємо завантаження та тимчасові файли
COPY server/uploads ./server/uploads
COPY server/temp ./server/temp

# Переходимо в серверну папку
WORKDIR /app/server
ENV NODE_ENV=production
# Запуск сервера
CMD ["node", "src/main.js"]
