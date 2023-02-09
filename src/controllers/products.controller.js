import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products;
    this.id = 1;
  }

  async #checkProducts() {
    this.products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(this.products);
  }

  async getProducts() {
    return await this.#checkProducts();
  }

  async addProduct(product) {
    let codeErr = false;
    let products = await this.getProducts();
    let result = { error: undefined, message: undefined };

    products.forEach((prod) => {
      prod.id ? (this.id = prod.id + 1) : (this.id = 1);
      if (prod.code === product.code) {
        codeErr = true;
      }
    });
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock ||
      !product.status ||
      !product.category
    ) {
      return (result = { error: true, message: "Completa todos los campos!" });
    } else {
      const newProduct = {
        id: this.id,
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails,
      };

      codeErr === true
        ? (result = { error: true, message: "El codigo ya esta en uso" })
        : products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products));
    }
    return result.error ? result : newProduct;
  }

  async getProductById(id) {
    let allProducts = await this.#checkProducts();

    let result = allProducts.find((product) => product.id === id);

    return result;
  }

  async deleteProductById(id) {
    let allProducts = await this.#checkProducts();

    let result = allProducts.find((product) => product.id === id);

    let destroyProduct = allProducts.filter((product) => product.id != id);
    await fs.writeFile(this.path, JSON.stringify(destroyProduct));
    return result;
  }

  async updateProducts(id, product) {
    let result = await this.getProductById(id);
    if (result) {
      let allProducts = await this.#checkProducts();

      let updatedProduct = allProducts.map((prod) => {
        if (prod.id === id) {
          prod.title = product.title;
          prod.description = product.description;
          prod.code = product.code;
          prod.price = product.price;
          (prod.status = product.status), (prod.stock = product.stock);
          prod.category = product.category;
          prod.thumbnail = product.thumbnail;
        }
        return prod;
      });

      await fs.writeFile(this.path, JSON.stringify(updatedProduct));
      return (result = updatedProduct);
    }

    return result;
  }
}

const newProduct = new ProductManager("./src/models/products.txt");

export { newProduct };
