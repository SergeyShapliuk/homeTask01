import express from "express";
import {setupApp} from "./setup-app";
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/db";
import dotenv from 'dotenv';

dotenv.config();

let isInitialized = false;
let appInstance: express.Application;

export const initApp = async () => {
    if (!isInitialized) {
        const app = express();
        setupApp(app);

        console.log("🔄 Connecting to database...");
        await runDB(SETTINGS.MONGO_URL);
        console.log("✅ Database connected");

        appInstance = app;
        isInitialized = true;

        // ✅ ВАЖНО: На Render используем порт из process.env.PORT
        const PORT = process.env.PORT || SETTINGS.PORT;

        // ✅ Обязательно указываем '0.0.0.0' для Render
        if (process.env.NODE_ENV === "production") {
            // Для Render: слушаем на 0.0.0.0
            app.listen(Number(PORT), "0.0.0.0", () => {
                console.log(`🚀 Production server listening on port ${PORT}`);
            });
        } else {
            // Для локальной разработки: без указания host
            app.listen(Number(PORT), () => {
                console.log(`🚀 Development server listening on port ${PORT}`);
            });
        }
    }

    return appInstance;
};

// ✅ Экспортируем инициализированное приложение
export default initApp();

// ✅ Всегда запускаем приложение
initApp().catch(console.error);
