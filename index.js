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
        app.get('/product', async(req, res)=>{
            const query ={};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const products = await productCollection.findOne(query);
            res.send(products)
        });

        app.post('/users',async(req,res) =>{
            const users = req.body;
            const result = await userCollection.insertOne(users);
            console.log('hitting the post',req.body);
            res.json(result)
          })
          
        app.get('/user/:email',async(req,res) =>{
            const email = req.params.email;
            const query = {email:email};
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
              isAdmin = true;
            }
            res.json({admin: isAdmin})
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