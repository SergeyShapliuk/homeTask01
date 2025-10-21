import {blogCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {Blog} from "../domain/blog";
import {BlogQueryInput} from "../routers/input/blog-query.input";
import {BlogAttributes} from "../application/dtos/blog-attributes";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";


export const blogsRepository = {
    // findAll(): Blog[] {
    //   return db.blogs;
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} =
            queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: "i"};
        }
        console.log("filter", filter);
        console.log("filter2", pageNumber, pageSize, sortBy, sortDirection,);
        console.log("searchNameTerm", searchNameTerm);
        // if (searchDriverEmailTerm) {
        //     filter.email = { $regex: searchDriverEmailTerm, $options: 'i' };
        // }
        //
        // if (searchVehicleMakeTerm) {
        //     filter['vehicle.make'] = { $regex: searchVehicleMakeTerm, $options: 'i' };
        // }

        const items = await blogCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogCollection.countDocuments(filter);

        return {items, totalCount};
    },

    // findById(id: number): Blog | null {
    //   return db.blogs.find((v) => +v.id === id) ?? null;
    // },

    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({_id: new ObjectId(id)});
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({_id: new ObjectId(id)});

        if (!res) {

            throw new RepositoryNotFoundError("Blog not exist");
        }
        return res;
    },
    // create(newBlog: Blog): Blog {
    //     db.blogs.push(newBlog);
    //     return newBlog;
    // },
    async create(newBlog: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();
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
    async update(id: string, newBlog: BlogAttributes): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: newBlog
            }
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("Blog not exist");
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
            throw new RepositoryNotFoundError("Blog not exist");
        }
        return;
    }
};
