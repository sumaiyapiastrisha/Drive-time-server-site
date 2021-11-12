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
        const serviceCollection = database.collection('bikes')//services collection
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        const orderedItemCollection = database.collection('orderedItem');
        // const orderedItemCollection = database.collection('orderdItem')//services collection



        app.post('/bikes', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });

        app.get('/bikes', async (req, res) => {


            const cursor = serviceCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);


        });

        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })


        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });

        app.get('/review', async (req, res) => {


            const cursor = reviewsCollection.find({});
            const review = await cursor.toArray();
            res.send(review);


        });


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        }),

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

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            // const requester = req.decodedEmail;
            // if (requester) {
            // const requesterAccount = await usersCollection.findOne({ email: email });
            // if (requesterAccount.role === 'admin') {
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
            // }
        });
        // else {
        //     res.status(403).json({ message: 'you do not have access to make admin' })
        // }

        // });



        app.post('/orderdItem', async (req, res) => {
            const item = req.body;
            const result = await orderedItemCollection.insertOne(item);
            res.json(result);
        });

        app.get('/orderdItem', async (req, res) => {
            const cursor = orderedItemCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

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