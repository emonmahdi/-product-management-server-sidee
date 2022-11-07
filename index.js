const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlqgi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 

/*  
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('Connect the MongoDB Database');
  // perform actions on the collection object
  client.close();
}); */

async function run(){

    try{
        await client.connect();
        const productCollection = client.db('productManegement').collection('products')
        
        
        // GET API
        app.get('/product', async(req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result); 
        });
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await productCollection.findOne(query);
            res.send(result)
        });

        // POST API Product
        app.post('/product', async(req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query);
            res.send(result)
        });
        // DELETE API 
        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });
        // UPDATE API
        app.put('/product/:id', async(req,res) => {
            const id = req.params.id;
            const updateProduct = req.body ;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true}
            const updateDoc = {
                $set:{
                    name:updateProduct.name,
                    img:updateProduct.img, 
                    price:updateProduct.price
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });
        // UPDATE GET API
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productCollection.findOne(query);
            res.send(result);
        })

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Products management server')
});


app.listen(port, () => {
    console.log('Server is Running..', port);
})