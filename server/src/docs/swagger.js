import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {

  definition: {

    openapi: "3.0.0",

    info: {

      title:
        "Smart Food Redistribution API",

      version: "1.0.0",

      description:
        "API Documentation"

    },

    servers: [

      {

        url:
          "http://localhost:5000"

      }

    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT"

        }

      }

    }

  },

  apis: [

    "./src/routes/*.js"

  ]

};

const specs =
  swaggerJsdoc(
    options
  );

export {
  swaggerUi,
  specs
};