import { postCollection } from '../../db/db';
import { ObjectId, WithId } from 'mongodb';
import { PostQueryInput } from '../routers/input/post-query.input';
import { PostAttributes } from '../application/dtos/post-attributes';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { Post } from '../domain/post';
import {PaginationAndSorting} from "../../core/types/pagination-and-sorting";
import {BlogSortField} from "../../blogs/routers/input/blog-sort-field";

export const postsRepository = {
  // findAll(): Post[] {
  //   return db.posts;
  // },
  // async findAll(): Promise<WithId<Post>[]> {
  //     return postCollection.find().toArray();
  // },
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
      // searchDriverEmailTerm,
      // searchVehicleMakeTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    // if (searchDriverEmailTerm) {
    //     filter.email = { $regex: searchDriverEmailTerm, $options: 'i' };
    // }
    //
    // if (searchVehicleMakeTerm) {
    //     filter['vehicle.make'] = { $regex: searchVehicleMakeTerm, $options: 'i' };
    // }

    const items = await postCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);

    return { items, totalCount };
  },

  // findById(id: number): Post | null {
  //   return db.posts.find((v) => +v.id === id) ?? null;
  // },
  async findPostsByBlog(
      paginationDto: PaginationAndSorting<BlogSortField>,
      blogId: string
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationDto;
    // ПРЕОБРАЗУЙТЕ СТРОКИ В ЧИСЛА
    const pageNum = parseInt(pageNumber as any);
    const pageSz = parseInt(pageSize as any);

    const filter = { blogId: blogId };

    const skip = (pageNum - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSz)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return res;
  },

  async findByBlogIdOrFail(blogId: string): Promise<WithId<Post>> {
    const res = await postCollection.findOne({ _blogId: new ObjectId(blogId) });

    if (!res) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return res;
  },
  // create(newPost: Post): Post {
  //   db.posts.push(newPost);
  //
  //   return newPost;
  // },
  async create(newPost: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);
    return insertResult.insertedId.toString();
  },

  // async createPostByBlog(id: string, postData: Omit<Post, "blogId" | "_id">): Promise<string> {
  //     const updateResult = await postCollection.insertOne(
  //         {
  //             _id: new ObjectId(id)
  //         },
  //         {
  //             $set: {
  //                 newBlog
  //             }
  //         }
  //     );
  //
  //     if (updateResult.matchedCount < 1) {
  //         throw new Error("Ride not exist");
  //     }
  //
  //     return;
  // },
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
  async update(id: string, newPost: PostAttributes): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: newPost,
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
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
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return;
  },
};
