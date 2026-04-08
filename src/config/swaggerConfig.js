const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order API',
      version: '1.0.0',
      description: 'API for managing products and orders',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
  },
  apis: [
    './src/controllers/productController.js',
    './src/controllers/orderController.js',
  ],
};

module.exports = swaggerConfig;
