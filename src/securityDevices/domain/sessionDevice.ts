export interface SessionDevice {
    deviceId: string;
    userId: string;
    ip: string;
    title: string; // из user-agent
    lastActiveDate: Date;
    expiresAt: Date; // ✅ дата окончания токена
    createdAt: Date;
}
