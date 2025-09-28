import {Blog} from "../types/blog";
import {blogCollection} from "../../db/db";
import {BlogInputDto} from "../dto/blog.input-dto";
import {ObjectId, WithId} from "mongodb";

export const blogsRepository = {
    // findAll(): Blog[] {
    //   return db.blogs;
    async findAll(): Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },

    // findById(id: number): Blog | null {
    //   return db.blogs.find((v) => +v.id === id) ?? null;
    // },
    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({_id: new Object(id)});
    },

    // create(newBlog: Blog): Blog {
    //     db.blogs.push(newBlog);
    //     return newBlog;
    // },
    async create(newBlog: Blog): Promise<WithId<Blog>> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return {...newBlog, _id: insertResult.insertedId};
    },

    // update(id: number, newBlog: BlogInputDto): void {
    //     const blog = db.blogs.find((v) => +v.id === id);
    //
    //     if (!blog) {
    //         throw new Error("Post not exist");
    //     }
    //     // --- Обновление ---
    //     Object.assign(blog, newBlog);
    //
    //     return;
    // },
    async update(id: string, newBlog: BlogInputDto): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: newBlog
            }
        );

        if (updateResult.matchedCount < 1) {
            throw new Error("Blog not exist");
        }
        return;
    },

    // delete(id: number): void {
    //     const index = db.blogs.findIndex((v) => +v.id === id);
    //
    //     if (index === -1) {
    //         throw new Error("Post not exist");
    //     }
    //
    //     db.blogs.splice(index, 1);
    //     return;
    // }
    async delete(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error("Blog not exist");
        }
        return;
    }
};
