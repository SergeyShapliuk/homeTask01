import {postLikeRepository} from "../repositories/posts.like.repository";


export const postLikeService = {

    async updateLikeStatus(postId: string,
                           userId: string,
                           login: string,
                           likeStatus: "Like" | "Dislike" | "None"): Promise<void> {
        await postLikeRepository.updateLikeStatus(
            postId,
            userId,
            login,
            likeStatus);
        return;
    }
};
