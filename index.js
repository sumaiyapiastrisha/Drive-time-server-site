const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owgxb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run() {

    try {
        await client.connect();
        const database = client.db('driveTime')//database name
        // database collection
        const serviceCollection = database.collection('bikes')
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        const orderedItemCollection = database.collection('orderedItem');


        // bikes post 

        app.post('/bikes', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });
        // get bikes
        app.get('/bikes', async (req, res) => {


            const cursor = serviceCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);


        });
        // delete bikes
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

        // post review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });
        // get review
        app.get('/review', async (req, res) => {


            const cursor = reviewsCollection.find({});
            const review = await cursor.toArray();
            res.send(review);


        });

        // post users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // get users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        }),
            // get users by email cheak admin or ni=ot
            app.get('/users/:email', async (req, res) => {
                const email = req.params.email;
                const query = { email: email };
                const user = await usersCollection.findOne(query);
                let isAdmin = false;
                if (user?.role === 'admin') {
                    isAdmin = true;
                }
                res.json({ admin: isAdmin });
            })
        // make user 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });



        //post ordered bikes
        app.post('/orderdItem', async (req, res) => {
            const item = req.body;
            const result = await orderedItemCollection.insertOne(item);
            res.json(result);
        });
        //get ordered bikes
        app.get('/orderdItem', async (req, res) => {
            const cursor = orderedItemCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        // delete ordered items
        app.delete('/orderdItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderedItemCollection.deleteOne(query);
            res.json(result);
        })

    }

    finally {
        // await client.close()
    }

}

run().catch(console.dir)

app.listen(port, () => {
    console.log('runing', port)
})