import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-ststuses';
import { postsRepository } from '../../repositories/posts.repository';
import {mapToPostViewModel} from "../mappers/map-to-post-view-model.util";

// export function getPostListHandler(req: Request, res: Response) {
//   const blogs = postsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }

export async function getPostListHandler(req: Request, res: Response) {
    try {
        const blogs = await postsRepository.findAll();
        const postViewModels = blogs.map(mapToPostViewModel);
        res.send(postViewModels);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
