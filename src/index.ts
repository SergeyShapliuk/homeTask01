import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/db";

let isInitialized = false;
let appInstance: express.Application;

export const initApp = async (): Promise<express.Application> => {
  if (!isInitialized) {
    const app = express();
    setupApp(app);

    console.log('🔄 Connecting to database...');
    await runDB(SETTINGS.MONGO_URL);
    console.log('✅ Database connected');

    appInstance = app;
    isInitialized = true;

    console.log('✅ App initialized');
  }

  return appInstance;
};

// ✅ Только экспортируем функцию, НЕ вызываем её
export default initApp;

// ✅ Запуск сервера только в одном месте
if (require.main === module) {
  // Этот блок выполнится только при прямом запуске файла
  initApp()
      .then((app) => {
        const PORT = SETTINGS.PORT;
        app.listen(PORT, () => {
          console.log(`🚀 Server listening on port ${PORT}`);
        });
      })
      .catch((error) => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
      });
}
