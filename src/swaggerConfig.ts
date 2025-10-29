import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Goomer Menu API",
      version: "1.0.0",
      description:
        "API RESTful para gerenciamento de produtos, promoções e exibição de cardápio com descontos automáticos.",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Smash Double Bacon BBQ" },
            price: { type: "number", example: 35.9 },
            category: { type: "string", example: "Pratos Principais" },
            description: {
              type: "string",
              example: "Hambúrguer duplo com queijo e molho barbecue artesanal",
            },
            visible: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "price", "category", "description"],
          properties: {
            name: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            description: { type: "string" },
            visible: { type: "boolean" },
          },
        },
        ProductUpdateInput: {
          type: "object",
          properties: {
            name: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            description: { type: "string" },
            visible: { type: "boolean" },
          },
        },
        Promotion: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            description: { type: "string", example: "Desconto de almoço" },
            discountPrice: { type: "number", example: 29.9 },
            daysOfWeek: { type: "array", items: { type: "string" } },
            startTime: { type: "string", example: "11:00" },
            endTime: { type: "string", example: "14:00" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PromotionInput: {
          type: "object",
          required: [
            "description",
            "discountPrice",
            "daysOfWeek",
            "startTime",
            "endTime",
          ],
          properties: {
            description: { type: "string" },
            discountPrice: { type: "number" },
            daysOfWeek: { type: "array", items: { type: "string" } },
            startTime: { type: "string" },
            endTime: { type: "string" },
          },
        },
        MenuItem: {
          type: "object",
          properties: {
            category: { type: "string", example: "Bebidas" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  price: { type: "number" },
                  discountedPrice: { type: "number" },
                  hasActivePromotion: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(options);
export default swaggerDocs;
