import { Router, Request, Response } from "express";
import {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from "../repositories/promotionRepository";

const router = Router();

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Lista todas as promoções
 *     tags: [Promoções]
 *     responses:
 *       200:
 *         description: Lista de promoções cadastradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const promotions = await getAllPromotions();
    res.status(200).json(promotions);
  } catch (error: any) {
    console.error("Error listing promotions:", error);
    res.status(500).json({ message: "Failed to fetch promotions" });
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Busca uma promoção específica por ID
 *     tags: [Promoções]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da promoção
 *     responses:
 *       200:
 *         description: Detalhes da promoção
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promoção não encontrada
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const promo = await getPromotionById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promotion not found" });
    res.status(200).json(promo);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Cria uma nova promoção
 *     tags: [Promoções]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromotionInput'
 *     responses:
 *       201:
 *         description: Promoção criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const promotion = await createPromotion(req.body);
    res.status(201).json(promotion);
  } catch (error: any) {
    console.error("Error creating promotion:", error);
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Atualiza uma promoção existente
 *     tags: [Promoções]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da promoção
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromotionInput'
 *     responses:
 *       200:
 *         description: Promoção atualizada com sucesso
 *       404:
 *         description: Promoção não encontrada
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await updatePromotion(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Promotion not found" });
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Remove uma promoção
 *     tags: [Promoções]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da promoção
 *     responses:
 *       204:
 *         description: Promoção removida com sucesso
 *       404:
 *         description: Promoção não encontrada
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await deletePromotion(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Promotion not found" });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
