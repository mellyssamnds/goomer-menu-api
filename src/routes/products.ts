import { Router, Request, Response } from "express";
import {
  createProductService,
  listProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/productService";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operações relacionadas aos produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await listProductsService();
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error listing products", error);
    return res.status(500).json({ message: "Error listing products" });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Busca um produto específico por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await getProductByIdService(req.params.id);
    return res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados de entrada inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", async (req: Request, res: Response) => {
  const { name, price, category, description, visible } = req.body;
  if (!name || !price || !category || !description) {
    return res.status(400).json({
      message:
        "The fields 'name', 'price', 'category' and 'description' are required",
    });
  }
  try {
    const newProduct = await createProductService({
      name,
      price,
      category,
      description,
      visible,
    } as any);
    return res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados de entrada inválidos.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:id", async (req: Request, res: Response) => {
  const { name, price, category, description, visible } = req.body;
  try {
    const updatedProduct = await updateProductService(req.params.id, {
      name,
      price,
      category,
      description,
      visible,
    } as any);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID do produto
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso (No Content).
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const success = await deleteProductService(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return res.status(400).json({ message: error.message });
  }
});

export default router;
