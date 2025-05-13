const { getDatabase } = require("../database");

const COLLECTION_NAME = "products";

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static add(product) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .findOne({ name: product.name })
      .then((existingProduct) => {
        if (existingProduct) {
          console.log(`Product '${product.name}' already exists.`);
          return;
        }

        db.collection(COLLECTION_NAME)
          .insertOne(product)
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  static findByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name });
  }

  static getAll(callback) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .find()
      .toArray()
      .then((products) => {
        if (typeof callback === "function") callback(products);
      })
      .catch((error) => {
        console.log(error);
        if (typeof callback === "function") callback([]);
      });
  }

  static deleteByName(name) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .deleteOne({ name })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  static getLast(callback) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
      .then((products) => {
        if (typeof callback === "function") callback(products[0]);
      })
      .catch((error) => {
        console.log(error);
        if (typeof callback === "function") callback(undefined);
      });
  }
}

module.exports = Product;
