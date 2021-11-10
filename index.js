const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const express = require('express')
const app = express()
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
// middleWare
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wwesd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("travel_Crafter").collection("services")
        const bookingCollection = client.db("travel_Crafter").collection("booking")
        // get api for products
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        })

        //get single product
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }

            const service = await serviceCollection.findOne(query)
            res.json(service)
        })

        //confirm order
        app.post('/confirmOrder', async (req, res) => {
            const result = await bookingCollection.insertOne(req.body)
            res.send(result);
        })
        //my confirm orders
        app.get('/myOrders/:email', async (req, res) => {
            const result = await bookingCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })
        //cancel order
        app.delete('/cancelOrder/:id', async (req, res) => {
            const result = await bookingCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result);
        })
        //all orders
        app.get('/allOrders', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        })
        //delete orders
        app.delete('/deletelOrder/:id', async (req, res) => {
            const result = await bookingCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('travel crafter server is runnig')
})

app.listen(port, () => {
    console.log('server is going on', port)
})