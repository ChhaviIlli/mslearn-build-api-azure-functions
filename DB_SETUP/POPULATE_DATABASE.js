// const Cosmos = require("@azure/cosmos");
// const products = require("./products.json");
// const yargs = require("yargs");

// // destructure command line arguments
// let { endpoint, key, databaseName, containerName } = yargs.argv;

// // create the cosmos client
// const client = new Cosmos.CosmosClient({ endpoint, key });

// const database = client.database(databaseName);
// const container = database.container(containerName);

// // insert the items into Cosmos DB
// products.forEach(async product => {
//   try {
//     await container.items.create(product);
//   } catch (err) {
//     console.log(err.message);
//   }
// });
const { MongoClient } = require("mongodb");
const products = require("./products.json");
const yargs = require("yargs");

// destructure command line arguments
let { connectionString, databaseName, collectionName } = yargs.argv;

// create the MongoDB client
const client = new MongoClient(connectionString);

async function run() {
  try {
    await client.connect();

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // insert the items into MongoDB
    await collection.insertMany(products);
  } catch (err) {
    console.log(err.message);
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

