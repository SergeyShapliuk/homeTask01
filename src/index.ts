import express from "express";
import {setupApp} from "./setup-app";
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/db";
import dotenv from "dotenv";
import lt from "localtunnel";

dotenv.config();

let isInitialized = false;
let appInstance: express.Application;

const initApp = async () => {
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
            // ✅ Сначала запускаем сервер
            app.listen(Number(PORT), () => {
                console.log(`🚀 Development server listening on port ${PORT}`);

                // ✅ Потом запускаем тунель (после старта сервера)
                // lt({ port: Number(PORT) }).then(tunnel => {
                //     console.log(`🌐 External URL: ${tunnel.url}`);
                // }).catch(error => {
                //     console.log('Tunnel failed:', error.message);
                // });
            });
            // try {
            //     const tunnelUrl = await TunnelService.start(5001);
            //     console.log(`🌐 External HTTPS URL: ${tunnelUrl}`);
            // } catch (error) {
            //     console.log('Ngrok not available, using localhost only');
            // }
            // Для локальной разработки: без указания host
            // app.listen(Number(PORT), () => {
            //     console.log(`🚀 Development server listening on port ${PORT}`);
            // });
        }
    }

    return appInstance;
};

// ✅ Экспортируем инициализированное приложение
export default initApp();

// ✅ Всегда запускаем приложение
initApp().catch(console.error);
