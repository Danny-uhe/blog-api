import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API documentation for Blog platform",
    },
    servers: [
      {
        url: "https://blog-api-duvv.onrender.com",
        description: "Live API Endpoint",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);













// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Blog API",
//       version: "1.0.0",
//     },
//   },
//   apis: ["./src/routes/*.js"],
// };

// export const swaggerSpec = swaggerJSDoc(options);
// export const swaggerUiMiddleware = swaggerUi.serve;
// export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);