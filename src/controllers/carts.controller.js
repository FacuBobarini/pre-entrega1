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

  async getCarts() {
    return await this.#checkCarts();
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

    return result.products;
  }

  async addProductToCart(pid, cid) {
    let productResult = await newProduct.getProductById(pid);
    let cartResult = await this.getCartById(cid);
    let newProd = true;
    let addProduct;
    let allCarts = await this.#checkCarts();

    let updatedCart = allCarts.map((cart) => {
      if (cart.id === cid) {
        addProduct = cart.products.map((prod) => {
          if (prod.products === productResult.id) {
            prod.quantity += 1;
            newProd = false;
          }
          return prod;
        });
        if (newProd) {
          addProduct = { product: productResult.id, quantity: 1 };
          cart.products.push(addProduct);
        }
      }
      return cart;
    });

    await fs.writeFile(this.path, JSON.stringify(updatedCart));
  }
}

const newCart = new CartManager("./src/carts.txt");

export { newCart };
