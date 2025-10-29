import * as promotionRepository from "../repositories/promotionRepository";
import { Promotion } from "../repositories/promotionRepository";

function isValidTimeInterval(time: string): boolean {
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    return false;
  }
  const minutes = parseInt(time.split(":")[1], 10);
  return [0, 15, 30, 45].includes(minutes);
}

export async function createPromotionService(
  data: promotionRepository.CreatePromotionDTO
): Promise<Promotion> {
    // Validação da Regra de Negócio (15 minutos)
  if (
    !isValidTimeInterval(data.startTime) ||
    !isValidTimeInterval(data.endTime)
  ) {
    throw new Error(
      "Schedules must be in 15 minute intervals (ex: 18:00, 18:15, 18:30)"
    );
  }

  if (data.discountPrice <= 0) {
    throw new Error("The promotional price must be greater than zero.");
  }

  return await promotionRepository.createPromotion(data);
}

export async function getAllPromotionsService(): Promise<Promotion[]> {
  return await promotionRepository.getAllPromotions();
}

export async function getPromotionByIdService(
  id: string
): Promise<Promotion | null> {
  return await promotionRepository.getPromotionById(id);
}


export async function updatePromotionService(
  id: string,
  data: promotionRepository.UpdatePromotionDTO
): Promise<Promotion | null> {
    // Validação da Regra de Negócio (15 minutos)
  if (data.startTime && !isValidTimeInterval(data.startTime)) {
    throw new Error("Start time should be in 15 minute intervals");
  }
  if (data.endTime && !isValidTimeInterval(data.endTime)) {
    throw new Error("End time should be in 15 minute intervals");
  }

  return await promotionRepository.updatePromotion(id, data);
}

export async function deletePromotionService(id: string): Promise<boolean> {
  return await promotionRepository.deletePromotion(id);
}