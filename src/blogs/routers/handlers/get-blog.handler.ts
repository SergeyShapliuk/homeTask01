import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {blogsRepository} from "../../repositories/blogs.repository";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model.util";

// export function getBlogHandler(req: Request, res: Response) {
//   const id = parseInt(req.params.id);
//   // Проверка на валидное целое число
//   if (isNaN(id) || !Number.isInteger(id) || id < 1) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//   // Поиск блога по ID
//   const blog = blogsRepository.findById(id);
//   if (!blog) {
//     return res.status(HttpStatus.NotFound).send('Not Found');
//   }
//   res.status(HttpStatus.Ok).send(blog);
// }

export async function getBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id;

        // Поиск блога по ID
        const blog = await blogsRepository.findById(id);
        if (!blog) {
            res.status(HttpStatus.NotFound).send("Not Found");
            return;
        }
        const blogViewModel = mapToBlogViewModel(blog);
        res.status(HttpStatus.Ok).send(blogViewModel);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
