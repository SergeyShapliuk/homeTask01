import express from 'express';
import { setupApp } from './setup-app';
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/db";

let isInitialized = false;
let appInstance: express.Application;

export const initApp = async () => {
  if (!isInitialized) {
    const app = express();
    setupApp(app);

    console.log('🔄 Connecting to database...');
    await runDB(SETTINGS.MONGO_URL);
    console.log('✅ Database connected');

    appInstance = app;
    isInitialized = true;

    // Локальный запуск
    if (process.env.NODE_ENV !== 'production') {
      const PORT = SETTINGS.PORT;
      app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
      });
    }
  }

  return appInstance;
};

// ✅ Экспортируем инициализированное приложение
export default initApp();

// Локальный запуск
if (process.env.NODE_ENV !== 'production') {
  initApp().catch(console.error);
}
