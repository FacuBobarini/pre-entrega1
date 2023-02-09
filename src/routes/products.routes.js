import { Router } from "express";
import { newProduct } from "../controllers/products.controller.js";
const productRouter = Router();

productRouter.get("/:pid", async (req, res) => {
  const product = await newProduct.getProductById(parseInt(req.params.pid));

  return product
    ? res.status(200).send(product)
    : res.status(404).send({ message: "No se encontró el producto" });
});

productRouter.get("/", async (req, res) => {
  const allProducts = await newProduct.getProducts();
  let products;

  if (req.query.limit) {
    products = allProducts.slice(0, req.query.limit);
  } else {
    products = allProducts;
  }

  res.status(200).send(products);
});

productRouter.post("/", async (req, res) => {
  const result = await newProduct.addProduct(req.body);
  return result.error
    ? res.status(400).send(result)
    : res.status(200).send(req.body);
});

productRouter.delete("/:pid", async (req, res) => {
  const product = await newProduct.deleteProductById(parseInt(req.params.pid));

  return product
    ? res.status(200).send({ message: "Se elimino el producto" })
    : res.status(404).send({ message: "No se encontró el producto" });
});

productRouter.put("/:pid", async (req, res) => {
  const product = await newProduct.updateProducts(
    parseInt(req.params.pid),
    req.body
  );

  return product
    ? res.status(200).send({ message: "Se modifico el producto" })
    : res.status(404).send({ message: "No se encontró el producto" });
});

export default productRouter;
