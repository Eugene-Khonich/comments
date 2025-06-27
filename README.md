# Comments SPA Application

## Описание

SPA-приложение для системы комментариев с поддержкой вложенных ответов, прикрепления файлов и CAPTCHA.

## Технологии

- **Frontend:** React 19, Vite, Formik, Yup
- **Backend:** Express.js, TypeORM, PostgreSQL
- **DevOps:** Docker, Docker Compose, Nginx
- **Дополнительно:** WebSocket, Sharp, svg-captcha

## Функциональность

- ✅ Создание комментариев с валидацией
- ✅ Вложенные ответы без ограничения глубины
- ✅ Прикрепление изображений (автореsize до 320x240)
- ✅ Прикрепление текстовых файлов (до 100кб)
- ✅ CAPTCHA защита
- ✅ HTML теги: `<a>`, `<strong>`, `<i>`, `<code>`
- ✅ Предпросмотр комментариев
- ✅ Сортировка по имени, email, дате
- ✅ Пагинация (25 записей на страницу)
- ✅ Защита от XSS и SQL инъекций

## Установка и запуск

```bash
# Клонирование
git clone https://github.com/Eugene-Khonich/comments.git
cd comments

# Создание .env файла
echo "POSTGRES_DB=comments
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret_password" > .env

# Запуск через Docker
docker-compose up --build

# Приложение доступно на http://localhost
```
