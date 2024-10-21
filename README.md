# E-commerce API Server

## Overview
This project is an E-commerce API that provides endpoints for managing products, carts, and users. It is built using Node.js, Express, Prisma for DB with Typescript.

## Features
- User authentication and authorization
- CRUD operations for products
- Cart management

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/coollad49/ecommerce_api_server.git
    ```
2. Navigate to the project directory:
    ```sh
    cd ecommerce_api_server
    ```
3. Install dependencies:
    ```sh
    pnpm install
    ```
4. Build project:
    ```sh
    pnpm build
    ```

## Usage
1. Start the server:
    ```sh
    pnpm start
    ```
2. Access the API at `http://localhost:3000`
3. Docs at `http://localhost:3000/docs`

## Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `GET /products` - Get all products
- `POST /products` - Add a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.