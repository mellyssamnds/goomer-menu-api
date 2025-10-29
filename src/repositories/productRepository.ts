import { QueryTypes } from "sequelize";
import sequelize from "../database/connection";

export interface CreateProductDTO {
  name: string;
  price: number;
  category: string;
  description: string;
  visible?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  visible?: boolean;
}


export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export async function createProduct(data: CreateProductDTO): Promise<Product> {
  const sql = `
    INSERT INTO products (
      id,
      name,
      price,
      category,
      description,
      visible
    ) VALUES (
      gen_random_uuid(),
      :name,
      :price,
      :category,
      :description,
      COALESCE(:visible, true)
    )
    RETURNING *;
  `;

  try {
    const [product] = await sequelize.query<Product>(sql, {
      replacements: {
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        visible: data.visible ?? true,
      },
      type: QueryTypes.SELECT,
    });

    return product;
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    throw new Error("Failed to create product in database");
  }
}


export async function getAllProducts(): Promise<Product[]> {
  const sql = `
    SELECT *
    FROM products
    ORDER BY "createdAt" DESC;
  `;

  try {
    const products = await sequelize.query<Product>(sql, {
      type: QueryTypes.SELECT,
    });

    return products;
  } catch (error: any) {
    console.error("Error fetching products:", error.message);
    throw new Error("Failed to fetch products");
  }
}


export async function getProductById(id: string): Promise<Product | null> {
  const sql = `
    SELECT *
    FROM products
    WHERE id = :id;
  `;

  try {
    const [product] = await sequelize.query<Product>(sql, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    return product || null;
  } catch (error: any) {
    console.error("Error fetching product by ID:", error.message);
    throw new Error("Failed to fetch product by ID");
  }
}


export async function updateProduct(
  id: string,
  data: UpdateProductDTO
): Promise<Product | null> {
  const sql = `
    UPDATE products
    SET
      name = COALESCE(:name, name),
      price = COALESCE(:price, price),
      category = COALESCE(:category, category),
      description = COALESCE(:description, description),
      visible = COALESCE(:visible, visible),
      "updatedAt" = NOW()
    WHERE id = :id
    RETURNING *;
  `;

  const replacements = {
    id,
    name: data.name ?? null,
    price: data.price ?? null,
    category: data.category ?? null,
    description: data.description ?? null,
    visible: data.visible ?? null,
  };

  try {
    const [updated] = await sequelize.query<Product>(sql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return updated || null;
  } catch (error: any) {
    console.error("Error updating product:", error.message);
    throw new Error("Failed to update product");
  }
}


export async function deleteProduct(id: string): Promise<boolean> {
  const sql = `
    DELETE FROM products
    WHERE id = :id
    RETURNING id;
  `;

  try {
    const [deleted] = await sequelize.query<{ id: string }>(sql, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    return !!deleted;
  } catch (error: any) {
    console.error("Error deleting product:", error.message);
    throw new Error("Failed to delete product");
  }
}
