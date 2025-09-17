import { Video } from '../../videos/types/video';
import { Blog } from '../../blogs/types/blog';
import { Post } from '../../posts/types/post';

export type DB = {
  videos: Video[];
  blogs: Blog[];
  posts: Post[];
};
