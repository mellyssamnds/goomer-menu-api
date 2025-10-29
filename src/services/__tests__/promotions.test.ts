import request from "supertest";
import app from "../../server"; 
import sequelize from "../../database/connection"; 
import { Product } from "../../repositories/productRepository"; 

let testProduct: Product | null = null; // Guarda o produto base

describe("Promotions API", () => {
  // Conecta ao banco e cria um produto base antes de tudo
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.query('DELETE FROM "promotions";');
      await sequelize.query('DELETE FROM "products";');

      // Cria produto para usar nos testes
      const res = await request(app).post("/api/products").send({
        name: "Produto Base Promo Super Basic",
        price: 20.0,
        category: "Bebidas",
        description: "Base Super Basic",
        visible: true,
      });
      if (res.status !== 201) throw new Error("Failed to create base product for tests");
      testProduct = res.body;

    } catch (error) {
      console.error("Critical error in beforeAll:", error);
      throw error; 
    }
  });

  // Fecha a conexão depois de tudo
  afterAll(async () => {
    await sequelize.close();
  });

  

  // Teste: Criar uma promoção 
  it("should list all promotions", async () => {
    const response = await request(app)
      .get("/promotions"); 

    // Verificações essenciais: Status 200 e se é um array
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});