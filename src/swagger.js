import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "Production-ready Blog API with Auth, Articles, Comments & Notifications",
    },

    servers: [
      {
        url: "https://blog-api-duvv.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Local server",
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

export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: "list",      // 👈 makes it look like screenshot
    defaultModelsExpandDepth: 1,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
});
















// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Blog API",
//       version: "1.0.0",
//       description: "API documentation for Blog platform",
//     },
//     servers: [
//       {
//         url: "https://blog-api-duvv.onrender.com",
//         description: "Live API Endpoint",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis: ["./src/routes/*.js"],
// };

// export const swaggerSpec = swaggerJSDoc(options);
// export const swaggerUiMiddleware = swaggerUi.serve;
// export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);













// // import swaggerJSDoc from "swagger-jsdoc";
// // import swaggerUi from "swagger-ui-express";

// // const options = {
// //   definition: {
// //     openapi: "3.0.0",
// //     info: {
// //       title: "Blog API",
// //       version: "1.0.0",
// //     },
// //   },
// //   apis: ["./src/routes/*.js"],
// // };

// // export const swaggerSpec = swaggerJSDoc(options);
// // export const swaggerUiMiddleware = swaggerUi.serve;
// // export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);