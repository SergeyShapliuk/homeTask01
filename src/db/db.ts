import {Collection, Db, MongoClient} from "mongodb";

import {SETTINGS} from "../core/settings/settings";
import {Blog} from "../blogs/domain/blog";
import {Post} from "../posts/domain/post";
import {DBVideo} from "../core/types/dbVideo";
import {User} from "../users/domain/user";
import {Comment} from "../coments/domain/comment";
import {BlacklistedToken, ensureTTLIndex} from "../auth/routers/guard/refreshTokenBlacklistService";
import {SessionDevice} from "../securityDevices/domain/sessionDevice";

// const VIDEOS_COLLECTION_NAME = "videos";
const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
const COMMENTS_COLLECTION_NAME = "comments";
const USERS_COLLECTION_NAME = "users";
const TOKEN_BLACKLIST_COLLECTION = "tokenBlacklist";
const DEVICES_COLLECTION_NAME = "devices";

export let client: MongoClient;
// export let videoCollection: Collection<Video>;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let commentCollection: Collection<Comment>;
export let userCollection: Collection<User>;
export let tokenBlacklistCollection: Collection<BlacklistedToken>;
export let devicesCollection: Collection<SessionDevice>;


// Подключения к бд
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    // Инициализация коллекций
    // videoCollection = db.collection<Video>(VIDEOS_COLLECTION_NAME);
    blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
    postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
    commentCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
    userCollection = db.collection<User>(USERS_COLLECTION_NAME);
    tokenBlacklistCollection = db.collection<BlacklistedToken>(TOKEN_BLACKLIST_COLLECTION);
    devicesCollection = db.collection<SessionDevice>(DEVICES_COLLECTION_NAME);

    // await ensureTTLIndex();
    // await ensureDevicesTTLIndex();

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log("✅ Connected to the database");
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}

// TTL индекс для автоматической очистки устаревших устройств
async function ensureDevicesTTLIndex() {
    try {
        await devicesCollection.createIndex(
            { "expiresAt": 1 },
            { expireAfterSeconds: 0 } // удалять когда expiresAt прошло
        );
        console.log("✅ Devices TTL index created");
    } catch (error) {
        console.error("❌ Error creating devices TTL index:", error);
    }
}

// для тестов
export async function stopDb() {
    if (!client) {
        throw new Error(`❌ No active client`);
    }
    await client.close();
}

export const dbVideo: DBVideo = {
    videos: []
    // blogs: [],
    // posts: []
};
