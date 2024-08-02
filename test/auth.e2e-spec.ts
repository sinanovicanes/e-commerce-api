import { AppModule } from '@/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  describe('POST /auth/sign-in', () => {
    it('should return 400 when email is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ password: 'password' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 when username is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ username: 'test-user', password: 'password' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
