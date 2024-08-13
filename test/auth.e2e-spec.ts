import { AppModule } from '@/app.module';
import { JwtAuthGuard } from '@/auth/guards';
import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        // disableErrorMessages: true,
      }),
    );

    await app.init();
  });

  describe('POST /auth/sign-up', () => {
    it('should return 400 when sign up dto is not valid', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ password: 'password' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 201 when user created', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          username: 'test-user',
          password: 'Password1234.',
          email: 'test@email.com',
          name: 'Test',
          lastname: 'User',
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('POST /auth/sign-in', () => {
    it('should return 404 when sign in dto is not valid', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ password: 'password' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for invalid credentials', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ username: 'test-user', password: 'password' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 200 for valid credentials', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ username: 'test-user', password: 'Password1234.' })
        .expect(HttpStatus.OK);
    });
  });

  describe('POST /auth/sign-out', () => {
    it('should return 401 when user not signed in', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-out')
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
