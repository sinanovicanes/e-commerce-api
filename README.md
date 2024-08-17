# E-Commerce API using NestJS

This repository is a project for building a scalable e-commerce API using [NestJS](https://nestjs.com/), MongoDB, and Iyzico for payment processing. It includes modules for authentication, product management, orders, shopping cart, merchant management, and payment integration.

## Features

- **User Authentication**
  - Local strategy (email and password)
  - Google OAuth 2.0 integration
  - JWT authentication
- **Email Service**
  - Account verification
  - Password reset
  - Order confirmation
- **User Management**
  - Profile and address management
- **Product Management**
  - CRUD operations for products
  - Product categories and tags
  - Product reviews and ratings
- **Shopping Cart**
  - Add, update, and remove items
  - Persisted carts for authenticated users
- **Merchant Management**
  - Merchant registration and verification
  - Product listings by merchants
- **Order Management**
  - Order creation, tracking, and history
- **Payment Processing**
  - Integration with Iyzico payment gateway
  - Payment intent creation and confirmation
- **Comprehensive Error Handling and Logging**

### Configuration

- **`.env.example`**: Template for environment variables.

## Usage

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sinanovicanes/e-commerce-api.git
   cd e-commerce-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy the `.env.example` to `.env` and fill in your environment variables, including MongoDB URI, JWT secret, and Iyzico API keys.

4. **Run the Application**

   ```bash
   npm run start:dev
   ```

5. **Testing**

   Run the tests using:

   ```bash
   npm run test
   ```

## License

This project is licensed under the [MIT License](LICENSE).
