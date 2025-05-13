const mongodb = require("mongodb");
const { DB_USER, DB_PASS } = require('./config');
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@mvc-labs.ucdlgjm.mongodb.net/?retryWrites=true&w=majority&appName=MVC-labs`;

let database; 

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connection to the database has been established.");
      database = client.db("shop"); 
      callback();
    })
    .catch((error) => console.log(error));
};

const getDatabase = () => {
  if (!database) {
    throw new Error("No database found."); 
  }
  return database; 
};

module.exports = { mongoConnect, getDatabase };
