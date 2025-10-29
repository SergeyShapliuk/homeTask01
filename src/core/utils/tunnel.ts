import ngrok from "ngrok";

export class TunnelService {
    static async start(port: number = 5001): Promise<string> {
        try {
            const url = await ngrok.connect(port);
            console.log(`✅ Ngrok tunnel started: ${url}`);
            return url;
        } catch (error) {
            console.error("❌ Ngrok failed:", error);
            throw error;
        }
    }

    static async stop(): Promise<void> {
        await ngrok.disconnect();
        await ngrok.kill();
    }
}
