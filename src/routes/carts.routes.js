import { Router } from "express";
import { newCart } from "../controllers/carts.controller.js";
const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  await newCart.addCart();
  return res.status(200).send({ message: "Se creo carro de compras" });
});

cartRouter.get("/:cid", async (req, res) => {
  const allCarts = await newCart.getCartById(parseInt(req.params.cid));

  res.status(200).send(allCarts.products);
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const addProduct = await newCart.addProductToCart(
    parseInt(req.params.pid),
    parseInt(req.params.cid)
  );
  return addProduct.error
    ? res.status(404).send(addProduct)
    : res.status(200).send(addProduct.message);
});

export default cartRouter;
