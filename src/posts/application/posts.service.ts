import { DomainError } from '../../core/errors/domain.error';

import { WithId } from 'mongodb';
import { Post } from '../domain/post';
import { postsRepository } from '../repositories/posts.repository';
import { PostAttributes } from './dtos/post-attributes';
import { PostQueryInput } from '../routers/input/post-query.input';
import { PaginationAndSorting } from '../../core/types/pagination-and-sorting';
import { PostSortField } from '../routers/input/post-sort-field';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import {BlogSortField} from "../../blogs/routers/input/blog-sort-field";

// export enum PostErrorCode {
//     AlreadyFinished = 'RIDE_ALREADY_FINISHED',
// }

export const postsService = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return postsRepository.findMany(queryDto);
  },

  async findPostsByBlog(
      paginationDto: PaginationAndSorting<BlogSortField>,
      blogId: string
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    await blogsRepository.findByIdOrFail(blogId);

    return postsRepository.findPostsByBlog(paginationDto, blogId);
  },

  async createForBlog(dto: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  }): Promise<any> {
    // Проверяем что блог существует и получаем его данные
    const blog = await blogsRepository.findByIdOrFail(dto.blogId);

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name, // Берем имя блога из найденного блога
      createdAt: new Date().toISOString(),
    };

    return await postsRepository.create(newPost);
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    return postsRepository.findByIdOrFail(id);
  },

  async create(dto: PostAttributes): Promise<string> {
    const post = await blogsRepository.findByIdOrFail(dto.blogId);

    if (!post) {
      throw new RepositoryNotFoundError(
        `Driver has an active ride. Complete or cancel the ride first`,
      );
    }

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: post.name,
      createdAt: new Date().toISOString(),
    };

    return await postsRepository.create(newPost);
  },

  async update(id: string, dto: PostAttributes): Promise<void> {
    await postsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    // const activeRide = await ridesRepository.findActiveRideByDriverId(id);

    // if (activeRide) {
    //     throw new DomainError(
    //         `Driver has an active ride. Complete or cancel the ride first`,
    //         DriverErrorCode.HasActiveRide,
    //     );
    // }

    await postsRepository.delete(id);
    return;
  },
};
