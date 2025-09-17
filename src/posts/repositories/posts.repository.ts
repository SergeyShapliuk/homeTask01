import { Post } from '../types/post';
import { db } from '../../db/db';
import { PostInputDto } from '../dto/post.input-dto';

export const postsRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: number): Post | null {
    return db.posts.find((v) => +v.id === id) ?? null;
  },

  create(newPost: Post): Post {
    db.posts.push(newPost);

    return newPost;
  },

  update(id: number, newPost: PostInputDto): void {
    const post = db.posts.find((v) => +v.id === id);

    if (!post) {
      throw new Error('Post not exist');
    }
    // --- Обновление ---
    Object.assign(post, newPost);

    return;
  },

  delete(id: number): void {
    const index = db.posts.findIndex((v) => +v.id === id);

    if (index === -1) {
      throw new Error('Post not exist');
    }

    db.posts.splice(index, 1);
    return;
  },
};
