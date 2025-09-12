import request from 'supertest';
import { app } from '../src';
import { VideoInputDto } from '../src/videos/dto/video.input-dto';
import { db } from '../src/db/db';

describe('/VIDEOS', () => {
  const testVideosData: VideoInputDto = {
    // id: 1,
    title: 'string',
    author: 'string',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + 86400000).toISOString(),
    availableResolutions: ['P144'],
  };

  it("should return 'Hello world!'", async () => {
    const res = await request.agent(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello world!');
  });

  beforeAll(async () => {
    await request.agent(app).delete('/testing/all-data').expect(204);
  });

  it('should clear all data with status 202', async () => {
    const res = await request.agent(app).delete('/testing/all-data');
    expect(res.status).toBe(204);
  });

  it('should return empty array', async () => {
    const res = await request.agent(app).get('/videos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  afterAll(async () => {});

  it('GET drivers = []', async () => {
    await request.agent(app).get('/videos/').expect([]);
  });

  it('- POST does not create the videos with incorrect data (no title, no author,)', async function () {
    await request
      .agent(app)
      .post('/videos')
      .send({
        title: '',
        author: '',
        availableResolutions: [''],
      })
      .expect(400);

    const res = await request.agent(app).get('/videos');
    expect(res.body).toEqual([]);
  });

  it('should create videos; POST /videos', async () => {
    const newVideo1: VideoInputDto = {
      ...testVideosData,
      // id: Date.now(),
      title: 'string',
      author: 'string',
      availableResolutions: ['P144'],
    };
    const newVideo2: VideoInputDto = {
      ...testVideosData,
      // id: Date.now(),
      title: 'string',
      author: 'string',
      availableResolutions: ['P240'],
    };

    const response1 = await request
      .agent(app)
      .post('/videos')
      .send(newVideo1)
      .expect(201);

    expect(response1.body).toMatchObject({
      id: expect.any(Number), // id должен быть числом
      title: 'string',
      author: 'string',
      canBeDownloaded: false,
      minAgeRestriction: null,
      availableResolutions: ['P144'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });

    // Создаем второе видео
    const response2 = await request
      .agent(app)
      .post('/videos')
      .send(newVideo2)
      .expect(201);

    // Проверяем ответ второго видео
    expect(response2.body).toMatchObject({
      id: expect.any(Number),
      title: 'string',
      author: 'string',
      canBeDownloaded: false,
      minAgeRestriction: null,
      availableResolutions: ['P240'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });

    const driverListResponse = await request
      .agent(app)
      .get('/videos')
      .expect(200);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('- GET videos by ID with incorrect id', async () => {
    await request.agent(app).get('/videos/helloWorld').expect(404);
  });

  it('+ GET videos by ID with correct id', async () => {
    const response = await request
      .agent(app)
      .get('/videos/' + db.videos[db.videos.length - 1].id)
      .send(testVideosData)
      .expect(200);

    // Проверяем ответ второго видео
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: 'string',
      author: 'string',
      canBeDownloaded: false,
      minAgeRestriction: null,
      availableResolutions: ['P240'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  it('GET videos', async () => {
    const response = await request.agent(app).get('/videos').expect(200);

    // Проверяем ответ второго видео
    expect(response.body).toMatchObject([
      {
        id: expect.any(Number),
        title: 'string',
        author: 'string',
        canBeDownloaded: false,
        minAgeRestriction: null,
        availableResolutions: ['P144'],
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
      },
      {
        id: expect.any(Number),
        title: 'string',
        author: 'string',
        canBeDownloaded: false,
        minAgeRestriction: null,
        availableResolutions: ['P240'],
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
      },
    ]);
  });

  it('DELETE driver by ID with correct id', async () => {
    await request
      .agent(app)
      .delete('/videos/' + db.videos[db.videos.length - 1].id)
      .expect(204);
  });
});
