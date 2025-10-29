import express from "express";
import dotenv from "dotenv";
import sequelize from "./database/connection";

import productsRouter from "./routes/products";
import promotionsRouter from "./routes/promotions";
import menuRouter from "./routes/menu";

import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swaggerConfig";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas principais
app.use("/api/products", productsRouter);
app.use("/promotions", promotionsRouter);
app.use("/menu", menuRouter);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota de teste simples
app.get("/", (_req, res) => {
  res.send("API Goomer is running!");
});

// Inicialização do servidor e conexão com o banco
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database successfully connected!");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Could not connect to database:", error);
    process.exit(1);
  }
}

// Chama a função startServer apenas se não estivermos no ambiente 'test'
// O 'supertest' irá iniciar o servidor por si próprio.
if (process.env.NODE_ENV !== "test") {
  startServer();
}


export default app;

