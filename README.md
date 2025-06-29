# 📝 Comments SPA Application

## 📌 Описание

Одностраничное приложение (SPA) для отображения и добавления комментариев с возможностью вложенных ответов, вложений, CAPTCHA, предпросмотра и моментального обновления через WebSocket.

## 🛠️ Технологии

### Frontend

- **React 19 + Vite**
- Formik & Yup (валидация)
- Axios
- WebSocket (автообновление)

### Backend

- **Express.js**
- TypeORM (PostgreSQL)
- svg-captcha (CAPTCHA)
- Sharp (ресайз изображений)
- Multer (загрузка файлов)

### DevOps

- Docker / Docker Compose
- .env конфигурация

## 🎯 Функциональность

- ✅ Добавление комментариев с вложенными ответами (неограниченная глубина)
- ✅ Сортировка по имени, email, дате (по убыванию/возрастанию)
- ✅ Пагинация по 25 комментариев
- ✅ CAPTCHA с генерацией изображений (буквы/цифры)
- ✅ Разрешённые HTML-теги: `<a>`, `<strong>`, `<i>`, `<code>`
- ✅ Проверка на закрытие тегов
- ✅ Предпросмотр комментария без перезагрузки
- ✅ Прикрепление файлов:

  - JPG/PNG/GIF (макс. 320x240, auto resize)
  - TXT (до 100кб)

- ✅ Защита от XSS и SQL-инъекций
- ✅ Мгновенное обновление через WebSocket

## 🔗 Демо (Render)

Приложение доступно по адресу:
👉 [https://comments-app-cv14.onrender.com](https://comments-app-cv14.onrender.com)

## 🧱 Структура проекта

```
comments/
├── client/        # React frontend (Vite)
├── server/        # Express backend
├── uploads/       # Каталог загруженных файлов
├── temp/          # Временные файлы (ресайз и т.п.)
├── Dockerfile     # Multistage build (клиент + сервер)
├── docker-compose.yaml
└── .env           # Настройки окружения
```

## 📦 Установка и запуск локально

```bash
# Клонируем репозиторий
git clone https://github.com/Eugene-Khonich/comments.git
cd comments

# Создаём .env файл
cat > .env <<EOF
PORT=3000

POSTGRES_DB=comments
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret_password

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=secret_password
DB_NAME=comments

DATABASE_URL=postgres://postgres:secret_password@db:5432/comments
VITE_API_BASE_URL=http://localhost:3000
EOF

# Запускаем проект
docker-compose up --build
```

После запуска:

- Сервер доступен по: [http://localhost:3000](http://localhost:3000)
- БД поднимается внутри Docker на `db:5432`

## ⚙️ Вебсокеты

- Сервер WebSocket работает на том же порту (3000) и на том же endpoint-е
- Используется для broadcast новых комментариев всем подключённым клиентам
- На клиенте подключение создаётся динамически с учётом `VITE_API_BASE_URL`

## 🔐 Безопасность

- Серверная и клиентская валидация данных
- Санитация HTML с разрешёнными тегами
- Фильтрация и проверка загрузки файлов (тип, размер, MIME)
- PostgreSQL — через ORM TypeORM, защита от SQL-инъекций

## 📁 Схема базы данных

- Таблица `Comment`: id, parentId, userName, email, homePage, text, createdAt

## 💡 Примечания

- Все зависимости устанавливаются в контейнере при `docker-compose up --build`
- Приложение работает как монолит: фронт сборки Vite попадает в `server/src/dist`
- Для успешного подключения `.env` должен быть в корне проекта и прописан в `env_file`

## ✅ Проверка чек-листа (тестовое задание)

| Пункт                                              | Статус |
| -------------------------------------------------- | ------ |
| Вложенные комментарии                              | ✅     |
| Сортировка по имени/email/дате                     | ✅     |
| CAPTCHA                                            | ✅     |
| Разрешённые HTML-теги и их валидация               | ✅     |
| Предпросмотр сообщений без перезагрузки            | ✅     |
| Загрузка изображений и TXT-файлов                  | ✅     |
| Защита от XSS и SQL-инъекций                       | ✅     |
| Мгновенное обновление без перезагрузки (WebSocket) | ✅     |
| Пагинация (25 комментариев на страницу)            | ✅     |
| Docker + README + схема БД + git-история           | ✅     |

---

**Автор**: [Eugene Khonich](https://github.com/Eugene-Khonich)
