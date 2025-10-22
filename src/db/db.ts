import {Collection, Db, MongoClient} from "mongodb";

import {SETTINGS} from "../core/settings/settings";
import {Blog} from "../blogs/domain/blog";
import {Post} from "../posts/domain/post";
import {DBVideo} from "../core/types/dbVideo";
import {User} from "../users/domain/user";

// const VIDEOS_COLLECTION_NAME = "videos";
const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
const USERS_COLLECTION_NAME = "users";

export let client: MongoClient;
// export let videoCollection: Collection<Video>;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    // Инициализация коллекций
    // videoCollection = db.collection<Video>(VIDEOS_COLLECTION_NAME);
    blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
    postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
    userCollection = db.collection<User>(USERS_COLLECTION_NAME);

    try {
        await client.connect();
        await db.command({ping: 1});
        console.log("✅ Connected to the database");
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
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
