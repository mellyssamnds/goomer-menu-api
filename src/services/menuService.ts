import * as menuRepository from "../repositories/menuRepository";
import { MenuItem } from "../repositories/menuRepository";


export async function getActiveMenuService(): Promise<MenuItem[]> {
  try {
    const menu = await menuRepository.getActiveMenu();
    return menu;
  } catch (error) {
    throw error;
  }
}