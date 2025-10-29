import { QueryTypes } from "sequelize";
import sequelize from "../database/connection";

export interface Promotion {
  id: string;
  description: string;
  discountPrice: number;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  productId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePromotionDTO {
  description: string;
  discountPrice: number;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  productId?: string;
}

export interface UpdatePromotionDTO extends Partial<CreatePromotionDTO> {}

export async function createPromotion(
  data: CreatePromotionDTO
): Promise<Promotion> {
  
  const sql = `
    INSERT INTO "promotions" (
      id, product_id, description, promo_price,
      days_of_week, start_time, end_time, "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid(),
      $1, $2, $3, $4, $5, $6,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING *;
  `;
  try {
    
    const [promotion] = await sequelize.query<Promotion>(sql, {
      bind: [
        data.productId,
        data.description,
        data.discountPrice,
        JSON.stringify(data.daysOfWeek), 
        data.startTime,
        data.endTime,
      ],
      type: QueryTypes.SELECT,
    });
    return promotion;
  } catch (error: any) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new Error("Produto não encontrado. Não é possível criar promoção.");
    }
    
    console.error("!!! Error detail in createPromotion repository:", error);
    throw new Error("Falha ao criar promoção no banco de dados."); // Erro genérico
  }
}

export async function getAllPromotions(): Promise<Promotion[]> {
  const sql = `SELECT * FROM promotions ORDER BY "createdAt" DESC;`;

  const promotions = await sequelize.query<Promotion>(sql, {
    type: QueryTypes.SELECT,
  });

  return promotions.map((p) => ({
    ...p,
    daysOfWeek:
      typeof p.daysOfWeek === "string" ? JSON.parse(p.daysOfWeek) : p.daysOfWeek,
  }));
}

export async function getPromotionById(
  id: string
): Promise<Promotion | null> {
  const sql = `SELECT * FROM promotions WHERE id = :id;`;

  const [promotion] = await sequelize.query<Promotion>(sql, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });

  if (!promotion) return null;
  return {
    ...promotion,
    daysOfWeek:
      typeof promotion.daysOfWeek === "string"
        ? JSON.parse(promotion.daysOfWeek)
        : promotion.daysOfWeek,
  };
}

export async function updatePromotion(
  id: string,
  data: UpdatePromotionDTO
): Promise<Promotion | null> {
  const sql = `
    UPDATE promotions
    SET
      description = COALESCE(:description, description),
      "discountPrice" = COALESCE(:discountPrice, "discountPrice"),
      "daysOfWeek" = COALESCE(:daysOfWeek, "daysOfWeek"),
      "startTime" = COALESCE(:startTime, "startTime"),
      "endTime" = COALESCE(:endTime, "endTime"),
      "updatedAt" = NOW()
    WHERE id = :id
    RETURNING *;
  `;

  const [updated] = await sequelize.query<Promotion>(sql, {
    replacements: {
      id,
      ...data,
      daysOfWeek: data.daysOfWeek
        ? JSON.stringify(data.daysOfWeek)
        : undefined,
    },
    type: QueryTypes.SELECT,
  });

  return updated || null;
}

export async function deletePromotion(id: string): Promise<boolean> {
  const sql = `DELETE FROM promotions WHERE id = :id RETURNING id;`;

  const [deleted] = await sequelize.query<{ id: string }>(sql, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });

  return !!deleted;
}
