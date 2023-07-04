import { MongoClient, Db, Collection } from 'mongodb';
import { ObjectId } from "mongodb";

const connectionString = process.env.CONNECTION_STRING;
const databaseName = "tailwind";
const collectionName = "products";

const productService = {
  async init() {
    try {
      this.client = await MongoClient.connect(connectionString);
      this.database = this.client.db(databaseName);
      this.collection = this.database.collection(collectionName);
      console.log('mongodb connection succeded' );
    } catch (err) {
      console.log(err.message);
    }
  },
  // async create(productToCreate) {
    
  //   const result = await this.collection.insertOne(productToCreate);
    
  //   if(result.acknowledged) {
  //     return { message: "Insertion successful" };
  //   } else {
  //     throw new Error('Insertion failed');
  //   }
  //   //return result.ops[0];
  // },
  async create(productToCreate) {
    console.log('productToCreate', productToCreate );
    const insertResult = await this.collection.insertOne(productToCreate);
    console.log('insertResult', insertResult);
    
    if (insertResult.insertedId) {
      const insertedDocument = await this.collection.findOne({ _id: insertResult.insertedId });
      console.log('insertedDocument', insertedDocument);
      return insertedDocument;
    } else {
      throw new Error('Insertion failed');
    }
  },
  
  async read(): Promise<string> {
    const resources = await this.collection.find().toArray();
    return JSON.stringify(resources);
  },
  // async update(product) {
  //   const result = await this.collection.replaceOne({ _id: product._id }, product);
  //   return result.ops[0];
  // },
  async update(product) {
    console.log('Product to update: ', product);
    if (product.stockUnits) {
      product.stockUnits = parseInt(product.stockUnits);
    }
    console.log('Prased Product to update: ', product);
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(product._id) },  // convert _id to ObjectId
      { $set: product },  // update product
      { returnOriginal: false }  // option to return the updated document
    );
  
    if (result.ok) {
      return result.value;  // the updated document
    } else {
      throw new Error('Update failed');
    }
  },
  async delete(id, brandName) {
    console.log('id to delete: ', id);
    const result = await this.collection.deleteOne({ _id: new ObjectId(id), "brand.name": brandName });
  },
};

productService.init();

export default productService;
