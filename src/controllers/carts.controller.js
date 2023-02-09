import { promises as fs } from "fs";
import { newProduct } from "./products.controller.js";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts;
    this.id = 1;
  }

  async #checkCarts() {
    this.carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(this.carts);
  }

  async addCart() {
    let carts = await this.#checkCarts();

    carts.forEach((cart) => {
      if (cart.id) this.id = cart.id + 1;
    });

    const newCart = {
      id: this.id,
      products: [],
    };
    carts.push(newCart);

    await fs.writeFile(this.path, JSON.stringify(carts));

    return newCart;
  }

  async getCartById(id) {
    let allCarts = await this.#checkCarts();
    let result = allCarts.find((cart) => cart.id === id);

    return result;
  }

  async addProductToCart(pid, cid) {
    let productResult = await newProduct.getProductById(pid);
    let cartResult = await this.getCartById(cid);
    let newProd = true;
    let result;

    if (productResult && cartResult) {
      let allCarts = await this.#checkCarts();
      let updatedCart = allCarts.map((cart) => {
        if (cart.id === cid) {
          cart.products.map((prod) => {
            if (prod.product === productResult.id) {
              prod.quantity += 1;
              newProd = false;
            }
            return prod;
          });
          if (newProd) {
            cart.products.push({ product: productResult.id, quantity: 1 });
          }
        }
        return cart;
      });
      await fs.writeFile(this.path, JSON.stringify(updatedCart));

      return (result = { error: false, message: "Se agrego el producto" });
    } else {
      result = { error: true, prodMessage: undefined, cartMessage: undefined };

      !productResult && (result.prodMessage = "No se encontro producto");
      !cartResult && (result.cartMessage = "No se encontro carro de compras");

      return result;
    }
  }
}

const newCart = new CartManager("./src/models/carts.txt");

export { newCart };
