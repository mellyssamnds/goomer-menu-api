import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  CreateProductDTO,
  UpdateProductDTO,
  Product,
} from "../repositories/productRepository";


export async function createProductService(data: CreateProductDTO): Promise<Product> {
  if (data.price <= 0) {
    throw new Error("The price must be greater than zero");
  }

  const validCategories = ["Entradas", "Pratos Principais", "Bebidas", "Sobremesas"];
  if (!validCategories.includes(data.category)) {
    throw new Error("Invalid category. Use: Entradas, Pratos Principais, Bebidas ou Sobremesas");
  }

  const product = await createProduct(data);
  return product;
}

export async function listProductsService(): Promise<Product[]> {
  return await getAllProducts();
}

export async function getProductByIdService(id: string): Promise<Product | null> {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function updateProductService(id: string, data: UpdateProductDTO): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) throw new Error("Producto not found");

  if (data.price && data.price <= 0) {
    throw new Error("The price must be greater than zero");
  }

  const updated = await updateProduct(id, data);
  return updated;
}

export async function deleteProductService(id: string): Promise<boolean> {
  const existing = await getProductById(id);
  if (!existing) throw new Error("Product not found");

  return await deleteProduct(id);
}
export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };

