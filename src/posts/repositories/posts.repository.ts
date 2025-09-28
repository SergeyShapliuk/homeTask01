import {Post} from "../types/post";
import {postCollection} from "../../db/db";
import {PostInputDto} from "../dto/post.input-dto";
import {ObjectId, WithId} from "mongodb";


export const postsRepository = {
    // findAll(): Post[] {
    //   return db.posts;
    // },
    async findAll(): Promise<WithId<Post>[]> {
        return postCollection.find().toArray();
    },

    // findById(id: number): Post | null {
    //   return db.posts.find((v) => +v.id === id) ?? null;
    // },
    async findById(id: string): Promise<WithId<Post> | null> {
        return postCollection.findOne({_id: new ObjectId(id)});
    },

    // create(newPost: Post): Post {
    //   db.posts.push(newPost);
    //
    //   return newPost;
    // },
    async create(newPost: Post): Promise<WithId<Post>> {
        const insertResult = await postCollection.insertOne(newPost);
        return {...newPost, _id: insertResult.insertedId};
    },

    // update(id: number, newPost: PostInputDto): void {
    //   const post = db.posts.find((v) => +v.id === id);
    //
    //   if (!post) {
    //     throw new Error('Post not exist');
    //   }
    //   // --- Обновление ---
    //   Object.assign(post, newPost);
    //
    //   return;
    // },
    async update(id: string, newPost: PostInputDto): Promise<void> {
        const updateResult = await postCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: newPost
            }
        );

        if (updateResult.matchedCount < 1) {
            throw new Error("Post not exist");
        }
        return;
    },

    // delete(id: number): void {
    //   const index = db.posts.findIndex((v) => +v.id === id);
    //
    //   if (index === -1) {
    //     throw new Error('Post not exist');
    //   }
    //
    //   db.posts.splice(index, 1);
    //   return;
    // },
    async delete(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error("Post not exist");
        }
        return;
    }
};
