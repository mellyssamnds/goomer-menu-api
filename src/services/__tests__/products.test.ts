import request from "supertest";
import app from "../../server"; 
import sequelize from "../../database/connection"; 

let createdProductId: string | null = null; // Guarda o ID do produto criado

describe("Products API (Basic)", () => {
  // Conecta ao banco 
  beforeAll(async () => {
    await sequelize.authenticate();
    // Limpa a tabela antes dos testes
    // await sequelize.query('DELETE FROM "products";');
  });

  // Fecha a conexão 
  afterAll(async () => {
    // Limpa a tabela depois dos testes
    // await sequelize.query('DELETE FROM "products";');
    await sequelize.close();
  });


  it("should create a new product", async () => {
    const newProductData = {
      name: "Produto Teste",
      price: 15.0,
      category: "Bebidas",
      description: "Descrição Produto Teste",
      visible: true,
    };

    const response = await request(app)
      .post("/api/products") 
      .send(newProductData);

    // Verificações essenciais: Status 201 e se um ID foi retornado
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("string");

    // Guarda o ID para usar nos outros testes
    createdProductId = response.body.id;
  });

  // Teste 2: Listar todos os produtos (GET All)
  it("should list all products", async () => {
    const response = await request(app)
      .get("/api/products"); 

    // Verificações essenciais: Status 200 e se é um array
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Teste 3: Buscar um produto por ID (GET By ID)
  it("should return a specific product by ID", async () => {
    // Garante que o teste anterior criou um produto
    if (!createdProductId) {
      throw new Error("Product ID not created in previous test, cannot run GET by ID test.");
    }

    const response = await request(app)
      .get(`/api/products/${createdProductId}`); 

    // Verificações essenciais: Status 200 e se o ID retornado é o correto
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdProductId);
    expect(response.body.name).toBe("Produto Teste"); // Verifica o nome do produto
  });

  // Teste 4: Atualizar um produto (PUT)
  it("should update a product", async () => {
    if (!createdProductId) {
      throw new Error("Product ID not created, cannot run PUT test.");
    }
    const updateData = {
      price: 18.50, // Atualiza apenas o preço
    };

    const response = await request(app)
      .put(`/api/products/${createdProductId}`) 
      .send(updateData);

    // Verifica Status 200 e se o preço foi atualizado (convertendo string para número)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdProductId);
    expect(parseFloat(response.body.price)).toBeCloseTo(updateData.price);
  });

  // Teste 5: Deletar um produto (DELETE)
  it("should delete a product", async () => {
    if (!createdProductId) {
      throw new Error("Product ID not created, cannot run DELETE test.");
    }

    const response = await request(app)
      .delete(`/api/products/${createdProductId}`); 

    // Verificação essencial: Status 204
    expect(response.status).toBe(204);

    // Tentativa de buscar o produto deletado (deve dar 404)
    const getResponse = await request(app).get(`/api/products/${createdProductId}`);
    expect(getResponse.status).toBe(404);
  });


  // Teste 6: Falha ao criar sem campos obrigatórios
  it("should fail to create product without required fields", async () => {
    const incompleteData = {
      name: "Produto Falho",
      // Faltando price, category, description
    };

    const response = await request(app)
      .post("/api/products")
      .send(incompleteData);

    // Verificação essencial: Status 400
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message"); // Verifica se há uma mensagem de erro
  });

  // Teste 7: Falha ao buscar ID inexistente
  it("should return 404 for non-existent product ID", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000";
    const response = await request(app).get(`/api/products/${nonExistentId}`);

    // Verificação essencial: Status 404
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found"); 
  });

});