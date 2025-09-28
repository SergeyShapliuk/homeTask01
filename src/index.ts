import express from 'express';
import { setupApp } from './setup-app';
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/db";

// Создаем приложение ВНЕ функции
const app = express();
setupApp(app);

const bootstrap = async () => {
  await runDB(SETTINGS.MONGO_URL);

  // Локальный запуск сервера
  if (process.env.NODE_ENV !== 'production') {
    const PORT = SETTINGS.PORT;
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  }

  return app;
};

// ✅ Явно экспортируем приложение
export default app;

// ✅ Экспортируем функцию инициализации
export const init = bootstrap;

// Локальный запуск
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
