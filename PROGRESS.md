# LeadRadar — Сохранённый прогресс

## ✅ Сделано
1. Код написан (backend + frontend)
2. Запушен на GitHub: https://github.com/ratiozi/leadradar
3. Задеплоен на VibeCode сервер: e2677ee0-e3d1-4670-a674-7853f054b62b
4. Файлы скачались и распаковались в /opt/app/
5. npm install выполнился

## ❌ Проблема
Приложение падает с ошибкой: `Cannot find module 'dotenv'`

**Причина:** npm install не установил зависимости. Нужно проверить структуру файлов.

## 🔧 Что делать
1. Проверить структуру файлов на сервере:
   ```
   ls -la /opt/app/
   ls -la /opt/app/backend/
   find /opt/app -name 'node_modules'
   ```

2. Если package.json не в /opt/app/backend/, нужно исправить команду install

3. Попробовать запустить npm install вручную:
   ```
   cd /opt/app/backend && npm install
   ```

4. Перезапустить сервис:
   ```
   systemctl restart app
   ```

## 📁 Структура проекта
```
LeadRadar/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── db/
│   ├── routes/
│   └── sync/
├── frontend/
│   ├── package.json
│   └── src/
```

## 🔗 Ссылки
- GitHub: https://github.com/ratiozi/leadradar
- Dropbox: https://www.dropbox.com/scl/fi/abq8u41hlllkzbc9088sm/leadradar-archive.zip
- VibeCode API: https://vibecode.bitrix24.tech/v1
- Сервер: e2677ee0-e3d1-4670-a674-7853f054b62b
- API Key: vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027
