import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-ststuses";
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../types/post";
import {BlogInputDto} from "../../../blogs/dto/blog.input-dto";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model.util";
import {PostInputDto} from "../../dto/post.input-dto";

// export function createPostHandler(
//     req: Request<{}, {}, PostInputDto>,
//     res: Response
// ) {
//     const {title, shortDescription, content, blogId} = req.body;
//
//     // --- Успех ---
//     const newPost: Post = {
//         id: (db.posts.length
//                 ? +db.posts[db.posts.length - 1].id + 1
//                 : 1
//         ).toString(),
//         title: title.trim(),
//         shortDescription: shortDescription.trim(),
//         content: content.trim(),
//         blogId: blogId.trim(),
//         blogName: ""
//     };
//
//     postsRepository.create(newPost);
//     return res.status(HttpStatus.Created).send(newPost);
// }

export async function createPostHandler(
    req: Request<{}, {}, PostInputDto>,
    res: Response
) {
    const {title, shortDescription, content, blogId} = req.body;

    // --- Успех ---
    try {
        const newPost: Post = {
            title: title.trim(),
            shortDescription: shortDescription.trim(),
            content: content.trim(),
            blogId: blogId.trim(),
            blogName: "",
            createdAt: new Date()
        };

        const createdPost = await postsRepository.create(newPost);
        const postViewModel = mapToPostViewModel(createdPost);
        res.status(HttpStatus.Created).send(postViewModel);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
