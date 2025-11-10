import {devicesCollection} from "../../db/db";
import {SessionDevice} from "../domain/sessionDevice";


export class DeviceService {
    // Создание новой сессии устройства
    static async createDevice(deviceData: Omit<SessionDevice, "createdAt">): Promise<void> {
        await devicesCollection.insertOne({
            ...deviceData,
            createdAt: new Date()
        });
    }

    // Получение всех активных устройств пользователя
    static async getUserDevices(userId: string): Promise<SessionDevice[]> {
        return await devicesCollection.find({
            userId,
            expiresAt: { $gt: new Date() }
        }).toArray();
    }

    // Поиск устройства по deviceId и userId
    static async findDevice(deviceId: string, userId: string): Promise<SessionDevice | null> {
        return await devicesCollection.findOne({
            deviceId,
            userId,
            expiresAt: { $gt: new Date() }
        });
    }

    // Удаление устройства
    static async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
        const result = await devicesCollection.deleteOne({ deviceId, userId });
        return result.deletedCount > 0;
    }

    // Удаление всех устройств кроме текущего
    static async deleteOtherDevices(userId: string, currentDeviceId: string): Promise<void> {
        await devicesCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
    }

    // Обновление lastActiveDate
    static async updateLastActive(deviceId: string): Promise<void> {
        await devicesCollection.updateOne(
            { deviceId },
            { $set: { lastActiveDate: new Date() } }
        );
    }
}
