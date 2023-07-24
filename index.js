const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lxquazy.mongodb.net/?retryWrites=true&w=majority`;

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

        const classesCollection = client.db('collegeDb').collection('classes');
        
        const admissionCollection= client.db('collegeDb').collection('forms');
        const reviewCollection= client.db('collegeDb').collection('reviews');

        app.post('/review', async (req, res) => {
            const newForm = req.body;
            const result = await reviewCollection.insertOne(newForm);
            console.log(result);
            res.send(result);
        })

        app.get('/allreview', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

         //  search text
         app.get("/collegeSearchByName/:text", async(req,res)=>{
            const searchText =req.params.text;
           const result = await classesCollection
           .find({ 'name' : { '$regex' : searchText, '$options' : 'i' } })
       .toArray();
       res.json(result);
   })

        app.post('/form', async (req, res) => {
            const newForm = req.body;
            const result = await admissionCollection.insertOne(newForm);
            console.log(result);
            res.send(result);
        })

        // get class by using id
    app.get('/forms/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}; 
        const result = await admissionCollection.findOne(query);
        res.send(result);
      })

        app.get('/allform', async (req, res) => {
            const cursor = admissionCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/selectClasses', async (req, res) => {
            const cursor = classesCollection.find().limit(3);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        // get class by using id
    app.get('/classes/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}; 
        const result = await classesCollection.findOne(query);
        res.send(result);
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
    res.send('college is running');
})

app.listen(port, () => {
    console.log(`college is runnig in port ${port}`);
})