import { WithId } from 'mongodb';
import { BlogAttributes } from './dtos/blog-attributes';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import { blogsRepository } from '../repositories/blogs.repository';
import { Blog } from '../domain/blog';

// export enum PostErrorCode {
//     AlreadyFinished = 'RIDE_ALREADY_FINISHED',
// }

export const blogsService = {
  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findMany(queryDto);
  },

  // async findRidesByDriver(
  //     queryDto: RideQueryInput,
  //     driverId: string,
  // ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
  //     await driversRepository.findByIdOrFail(driverId);
  //
  //     return postsRepository.findRidesByDriver(queryDto, driverId);
  // },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(id);
  },

  async create(dto: BlogAttributes): Promise<string> {
    // const post = await postsRepository.findByIdOrFail(dto.blogId);

    // // Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    // const activeRide = await postsRepository.findActiveRideByDriverId(
    //     dto.driverId,
    // );
    //
    // if (activeRide) {
    //     throw new DomainError(
    //         `Driver has an active ride. Complete or cancel the ride first`,
    //         DriverErrorCode.HasActiveRide,
    //     );
    // }
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    return await blogsRepository.create(newBlog);
  },

  async update(id: string, dto: BlogAttributes): Promise<void> {
    await blogsRepository.update(id, dto);
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

    await blogsRepository.delete(id);
    return;
  },
};
