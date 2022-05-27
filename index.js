const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { get } = require('express/lib/response');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mejey.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log('database connected');
        const productCollection = client.db('menufacturer_website').collection('product');
        const userCollection = client.db('menufacturer_website').collection('user');
        const reviewCollection = client.db('menufacturer_website').collection('review');
        const orderCollection = client.db('menufacturer_website').collection('order');
        app.get('/product', async(req, res)=>{
            const query ={};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.get('/reviews', async(req, res)=>{
            const query ={};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        });
        app.post('/reviews',async(req,res) =>{
            const newReview = req.body;
            const reviews = reviewCollection.insertOne(newReview);
            res.send(reviews)
        })
        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const products = await productCollection.findOne(query);
            res.send(products)
        });
        app.post('/product', async(req, res) =>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })
        app.delete('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/users',async(req,res) =>{
            const users = req.body;
            const result = await userCollection.insertOne(users);
            console.log('hitting the post',req.body);
            res.send(result)
          })
          
        app.get('/user/:email',async(req,res) =>{
            const email = req.params.email;
            const query = {email:email};
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
              isAdmin = true;
            }
            res.send({admin: isAdmin})
        })
        app.delete('/orders/:id',async(req,res) =>{
            const id=req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('delete the id',result);
            res.json(result)
          })
        app.get('/orders', async(req, res)=>{
            const email = req.query.email;
            const query = {email:email};
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send((order))
        })
        app.post('/order', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })  
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Running manufacturer website')
});

app.listen(port, () =>{
    console.log('Listening to port, port')
})