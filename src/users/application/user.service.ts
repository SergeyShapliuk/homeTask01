import {WithId} from "mongodb";
import {User} from "../domain/user";
import {usersRepository} from "../repositories/users.repository";
import {UserQueryInput} from "../routers/input/user-query.input";
import {UserAttributes} from "./dtos/user-attributes";

// export enum PostErrorCode {
//     AlreadyFinished = 'RIDE_ALREADY_FINISHED',
// }

export const userService = {
    async findMany(
        queryDto: UserQueryInput
    ): Promise<{ items: WithId<User>[]; totalCount: number }> {
        return usersRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        return usersRepository.findByIdOrFail(id);
    },

    async create(dto: UserAttributes): Promise<string> {
        // const post = await blogsRepository.findByIdOrFail(dto.id);
        //
        // if (!post) {
        //   throw new RepositoryNotFoundError(
        //     `User not found`,
        //   );
        // }

        const newUser: User = {
            login: dto.login,
            email: dto.email,
            createdAt: new Date().toISOString()
        };

        return await usersRepository.create(newUser);
    },

    async delete(id: string): Promise<void> {

        await usersRepository.delete(id);
        return;
    }
};
