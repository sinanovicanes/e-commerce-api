import { CookieFields } from '@/auth/enums';
import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('E-Commerce API')
  .setDescription('API for an e-commerce application')
  .setVersion('1.0')
  .addCookieAuth(CookieFields.ACCESS_TOKEN)
  .addTag('auth', 'Operations related to authentication')
  .addTag('users', 'Operations related to users')
  .addTag('merchants', 'Operations related to merchants')
  .addTag('products', 'Operations related to products')
  .addTag('product-questions', 'Operations related to product questions')
  .addTag('cart', 'Operations related to the cart')
  .addTag('orders', 'Operations related to orders')
  .build();
