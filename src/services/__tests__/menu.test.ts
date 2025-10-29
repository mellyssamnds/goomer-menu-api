import request from "supertest";
import app from "../../server"; 
import sequelize from "../../database/connection"; 
import { Product } from "../../repositories/productRepository"; 


describe("Menu API (Super Basic)", () => {
  let visibleProduct: Product;
  let invisibleProduct: Product;

  // Função helper simplificada para obter o nome do dia da semana
  const getCurrentDayName = (): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  // Cria 2 produtos (1 visível, 1 invisível) e 1 promoção ativa
  beforeAll(async () => {
    try { 
      await sequelize.authenticate();
      // Limpa as tabelas antes dos testes
      await sequelize.query('DELETE FROM "promotions";');
      await sequelize.query('DELETE FROM "products";');

      // Cria Produto Visível
      const resVisible = await request(app).post("/api/products").send({
        name: "Produto Visível Basic", price: 10.0, category: "Bebidas",
        description: "Visível Basic", visible: true,
      });
      if (resVisible.status !== 201) throw new Error("Failed to create visible product for test");
      visibleProduct = resVisible.body;

      // Cria Produto Não Visível
      const resInvisible = await request(app).post("/api/products").send({
        name: "Produto Invisível Basic", price: 5.0, category: "Entradas",
        description: "Invisível Basic", visible: false,
      });
       if (resInvisible.status !== 201) throw new Error("Failed to create invisible product for test");
      invisibleProduct = resInvisible.body;

      // Cria Promoção Ativa para o Produto Visível
      const now = new Date();
      const currentHour = now.getHours();
      const currentQuarter = Math.floor(now.getMinutes() / 15) * 15;
      const startTime = `${currentHour.toString().padStart(2, "0")}:${currentQuarter.toString().padStart(2, "0")}`;
      const nextHour = (currentHour + 1) % 24;
      const endTime = `${nextHour.toString().padStart(2, "0")}:${currentQuarter.toString().padStart(2, "0")}`;

      const resPromo = await request(app).post("/promotions").send({
        product_id: visibleProduct.id,
        description: "Promo Ativa Basic",
        promo_price: 8.0, // Preço promocional
        days_of_week: [getCurrentDayName()],
        start_time: startTime,
        end_time: endTime,
      });
      if (resPromo.status !== 201) {
          console.error("Falha ao criar promoção de teste:", resPromo.body);
          // Não lançamos erro aqui para permitir que os outros testes rodem
      }

    } catch(error) {
        console.error("Error in beforeAll setup:", error);
        // Falha no setup impede os testes de rodarem corretamente
        throw error;
    }
  });

  // Fecha a conexão depois de tudo
  afterAll(async () => {
    await sequelize.close();
  });


  // Teste: Verifica se a rota responde com sucesso (200 OK) e retorna um array
  it("should respond with status 200 and return an array", async () => {
    const res = await request(app).get("/menu"); //

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Teste: Verifica se o produto Não Visível NÃO está na resposta
  it("should not include invisible products", async () => {
    const res = await request(app).get("/menu");

    expect(res.status).toBe(200); 

    // Procura o ID do produto invisível em qualquer categoria/item
    const foundInvisible = res.body.some((categoryGroup: any) =>
        categoryGroup.items.some((item: any) => item.id === invisibleProduct.id)
    );
    expect(foundInvisible).toBe(false); 
  });

});