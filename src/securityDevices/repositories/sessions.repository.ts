import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {devicesCollection} from "../../db/db";
import {SessionDevice} from "../domain/sessionDevice";
import {jwtService} from "../../core/adapters/jwt.service";


export const sessionsRepository = {

    async findMany(userId: string): Promise<SessionDevice[] | null> {
        const devices = await devicesCollection
            .find(
                {userId},
                {
                    projection: {
                        _id: 0,
                        deviceId: 1,
                        ip: 1,
                        title: 1,
                        lastActiveDate: 1,
                        expiresAt: 1,
                        createdAt: 1
                    }
                }
            )
            .toArray();

        // Возвращаем null, если нет устройств
        return devices.length > 0 ? (devices as SessionDevice[]) : null;
    },

    async findByDeviceId(deviceId: string): Promise<WithId<SessionDevice> | null> {
        return devicesCollection.findOne({deviceId});
    },

    async deleteOne(userId: string, deviceId: string): Promise<boolean> {
        const deleteResult = await devicesCollection.deleteOne({userId, deviceId});
        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Session not exist");
        }
        return true;
    },

    // async findByIdOrFail(userId: string, deviceId: string): Promise<boolean> {
    //     const device = await devicesCollection.findOne({deviceId});
    //     if (!device) {
    //         throw new RepositoryNotFoundError("Device not found");
    //     }
    //     const deleteResult = await devicesCollection.deleteOne({userId, deviceId});
    //
    //     if (deleteResult.deletedCount < 1) {
    //         throw new RepositoryNotFoundError("Session not exist");
    //     }
    //     return true;
    // },

    async create(newDevice: SessionDevice): Promise<string> {
        const insertResult = await devicesCollection.insertOne(newDevice);
        return insertResult.insertedId.toString();
    },

    async delete(refreshToken: string): Promise<void> {
        const payload = await jwtService.decodeToken(refreshToken);
        const {userId, deviceId} = payload;
        console.log({payload});
        const deleteResult = await devicesCollection.deleteMany({
            userId,
            deviceId: {$ne: deviceId}
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("User not exist");
        }
        return;
    }

};
