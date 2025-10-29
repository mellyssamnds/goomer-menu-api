import { QueryTypes } from "sequelize";
import sequelize from "../database/connection"; //


interface RawProductPromotion {
  id: string;
  name: string;
  price: string; 
  description: string; 
  category: string;
  visible: boolean;
  promo_price?: string; 
  days_of_week?: string[]; 
  start_time?: string; 
  end_time?: string; 
  promotion_description?: string; 
}


interface MenuItemOutput {
  id: string;
  name: string;
  description: string; 
  price: number; 
  category: string;
  hasActivePromotion: boolean;
  promotional_price?: number; 
  promotion_description?: string; 
}


interface MenuGroup {
  category: string;
  items: MenuItemOutput[];
}


export async function getMenu(): Promise<MenuGroup[]> {

  const sql = `
    SELECT
      p.id,
      p.name,
      p.price,
      p.description, -- Adicionada descrição do produto
      p.category,
      p.visible,
      pr.promo_price, -- Nome correto
      pr.days_of_week, -- Nome correto
      pr.start_time, -- Nome correto
      pr.end_time, -- Nome correto
      pr.description AS promotion_description -- Pegamos a descrição da promoção
    FROM products p
    LEFT JOIN promotions pr ON pr.product_id = p.id
    WHERE p.visible = true;
  `;

  try { 
    const products = await sequelize.query<RawProductPromotion>(sql, { type: QueryTypes.SELECT });

    const now = new Date();
    // Usa toLocaleString com 'en-GB' para formato HH:mm consistente
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });

    const processedItems: MenuItemOutput[] = products.map((p) => {
      let hasActivePromotion = false;
      let actualPromoPrice: number | undefined;

      
      if (p.days_of_week && p.start_time && p.end_time) { // Verifica se a promoção existe
          // Verifica o dia
          if (p.days_of_week.includes(currentDay)) {
              
              // Remove segundos do start/end time vindos do banco (ex: '18:00:00' -> '18:00')
              const startTime = p.start_time.slice(0, 5);
              const endTime = p.end_time.slice(0, 5);

              if (startTime <= currentTime && currentTime < endTime) { 
                  hasActivePromotion = true;
                  actualPromoPrice = p.promo_price ? parseFloat(p.promo_price) : undefined;
              }
          }
      }

      // Preço final: promocional se ativo, senão original
      const finalPrice = hasActivePromotion && actualPromoPrice !== undefined
                         ? actualPromoPrice
                         : parseFloat(p.price);

      return {
        id: p.id,
        name: p.name,
        description: p.description, 
        price: finalPrice,
        category: p.category,
        hasActivePromotion,
        promotional_price: hasActivePromotion ? actualPromoPrice : undefined,
        promotion_description: hasActivePromotion ? p.promotion_description : undefined,
      };
    });

    
    const grouped: Record<string, MenuGroup> = {};
    for (const item of processedItems) {
      if (!grouped[item.category]) {
        grouped[item.category] = { category: item.category, items: [] };
      }
      grouped[item.category].items.push(item);
    }

    // Ordena as categorias 
    const sortedCategories = Object.values(grouped).sort((a, b) => a.category.localeCompare(b.category));
    return sortedCategories;

  } catch (error) { 
      console.error("SQL Error in getMenu:", error);
      throw new Error("Failed to fetch menu data from database.");
  }
}