import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('E-Commerce API')
  .setDescription('API for an e-commerce application')
  .setVersion('1.0')
  .addCookieAuth('access_token')
  .addTag('users', 'Operations related to users')
  .addTag('auth', 'Operations related to authentication')
  .addTag('products', 'Operations related to products')
  .addTag('cart', 'Operations related to the cart')
  .addTag('orders', 'Operations related to orders')
  .build();
