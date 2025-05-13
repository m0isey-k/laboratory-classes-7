const { getDatabase } = require("../database");
const Product = require("./Product");

const COLLECTION_NAME = "carts";

class Cart {
  constructor(userId) {
    this.userId = userId;
  }

  static add(userId, productName) {
    const db = getDatabase();

    Product.findByName(productName)
      .then((product) => {
        if (!product) {
          console.log(`Product '${productName}' not found.`);
          return;
        }

        db.collection(COLLECTION_NAME)
          .findOne({ userId })
          .then((cart) => {
            if (!cart) {
              const newCart = {
                userId,
                items: [{ product, quantity: 1 }],
              };

              db.collection(COLLECTION_NAME)
                .insertOne(newCart)
                .then((result) => console.log(result))
                .catch((error) => console.log(error));

              return;
            }

            const existingItemIndex = cart.items.findIndex(
              (item) => item.product.name === productName
            );

            if (existingItemIndex > -1) {
              cart.items[existingItemIndex].quantity += 1;
            } else {
              cart.items.push({ product, quantity: 1 });
            }

            db.collection(COLLECTION_NAME)
              .updateOne({ userId }, { $set: { items: cart.items } })
              .then((result) => console.log(result))
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  static getItems(userId, callback) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .findOne({ userId })
      .then((cart) => {
        if (!cart || !cart.items) {
          if (typeof callback === "function") callback([]);
          return;
        }

        if (typeof callback === "function") callback(cart.items);
      })
      .catch((error) => {
        console.log(error);
        if (typeof callback === "function") callback([]);
      });
  }

  static getProductsQuantity(userId, callback) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .findOne({ userId })
      .then((cart) => {
        if (!cart || !cart.items) {
          if (typeof callback === "function") callback(0);
          return;
        }

        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        if (typeof callback === "function") callback(total);
      })
      .catch((error) => {
        console.log(error);
        if (typeof callback === "function") callback(0);
      });
  }

  static getTotalPrice(userId, callback) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .findOne({ userId })
      .then((cart) => {
        if (!cart || !cart.items) {
          if (typeof callback === "function") callback(0);
          return;
        }

        const total = cart.items.reduce((sum, item) => {
          return sum + item.product.price * item.quantity;
        }, 0);

        if (typeof callback === "function") callback(total);
      })
      .catch((error) => {
        console.log(error);
        if (typeof callback === "function") callback(0);
      });
  }

  static clearCart(userId) {
    const db = getDatabase();

    db.collection(COLLECTION_NAME)
      .updateOne({ userId }, { $set: { items: [] } })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }
}

module.exports = Cart;
