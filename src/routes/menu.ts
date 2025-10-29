import { Router, Request, Response } from "express";
import { getMenu } from "../repositories/menuRepository";

const router = Router();

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Retorna o cardápio completo com promoções ativas aplicadas
 *     tags: [Cardápio]
 *     responses:
 *       200:
 *         description: Lista de categorias com produtos (e descontos se aplicáveis)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const menu = await getMenu();
    res.status(200).json(menu);
  } catch (error: any) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

export default router;
