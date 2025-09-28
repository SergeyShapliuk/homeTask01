import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {blogsRepository} from "../../repositories/blogs.repository";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model.util";


// export function getBlogListHandler(req: Request, res: Response) {
//   const blogs = blogsRepository.findAll();
//   res.status(HttpStatus.Ok).send(blogs);
// }
export async function getBlogListHandler(req: Request, res: Response) {
    try {
        const blogs = await blogsRepository.findAll();
        const blogViewModels = blogs.map(mapToBlogViewModel);
        res.status(HttpStatus.Ok).send(blogViewModels);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
