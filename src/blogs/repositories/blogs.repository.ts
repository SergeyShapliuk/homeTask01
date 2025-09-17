import { Blog } from '../types/blog';
import { db } from '../../db/db';
import { BlogInputDto } from '../dto/blog.input-dto';

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: number): Blog | null {
    return db.blogs.find((v) => +v.id === id) ?? null;
  },

  create(newBlog: Blog): Blog {
    db.blogs.push(newBlog);

    return newBlog;
  },

  update(id: number, newBlog: BlogInputDto): void {
    const blog = db.blogs.find((v) => +v.id === id);

    if (!blog) {
      throw new Error('Post not exist');
    }
    // --- Обновление ---
    Object.assign(blog, newBlog);

    return;
  },

  delete(id: number): void {
    const index = db.blogs.findIndex((v) => +v.id === id);

    if (index === -1) {
      throw new Error('Post not exist');
    }

    db.blogs.splice(index, 1);
    return;
  },
};
