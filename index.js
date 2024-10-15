const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gnzeig.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const carCollection = client.db('carDB').collection('cars')

        const cartCollection = client.db('cartDB').collection('cart')

        app.get('/products/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.post('/products/cart', async (req, res) => {
            const cart = req.body;
            console.log('cart item ', cart)
            const result = await cartCollection.insertOne(cart);
            res.send(result)
        })

        app.delete('/products/cart/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)

        })

        app.get('/products', async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query)
            res.send(result)
        })


        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await carCollection.insertOne(newProduct)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedProduct = req.body
            const product = {
                $set: {
                    image: updatedProduct.image,
                    name: updatedProduct.name,
                    brandName: updatedProduct.brandName,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    shortDes: updatedProduct.shortDes,
                    rating: updatedProduct.rating
                }
            }

            const result = await carCollection.updateOne(filter, product, option)
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Brand Management server is running")
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})


