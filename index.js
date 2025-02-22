const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nsu-library.web.app",
      "https://nsu-library.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.SECRET_KEY}@cluster0.xj6e7zx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const addBookListCollection = client.db("libraryBookListDB").collection("libraryBookList");
    const bookBorrowListCollection = client.db("libraryBookListDB").collection("bookBorrowList");

    app.get('/addBook', async (req, res) => {
      const cursor = addBookListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/addBook', async (req, res) => {
      const addBook = req.body;
      const result = await addBookListCollection.insertOne(addBook);
      res.send(result);
    })

    app.get('/borrowBook', async (req, res) => {
      const cursor = bookBorrowListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/borrowBook', async (req, res) => {
      const borrowBook = req.body;
      const result = await bookBorrowListCollection.insertOne(borrowBook);
      res.send(result);
    })

    app.get('/borrowBook/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addBookListCollection.findOne(query);
      res.send(result);
    })

    app.delete('/borrowBook/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addBookListCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/addBook/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addBookListCollection.findOne(query);
      res.send(result);
    })

    app.put('/addBook/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateInfo = req.body;
      const info = {
        $set: {
          email: updateInfo.email,
          image: updateInfo.image,
          book_name: updateInfo.book_name,
          author_name: updateInfo.author_name,
          category: updateInfo.category,
          quantity: updateInfo.quantity,
          short_description: updateInfo.short_description,
          rating: updateInfo.rating,
          book_content: updateInfo.book_content
        }
      }
      const result = await addBookListCollection.updateOne(filter, info, options);
      res.send(result);
    })

    app.delete('/addBook/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addBookListCollection.deleteOne(query);
      res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('NSU Library server is running')
})

app.listen(port, () => {
  console.log(`NSU Library server is running on ${port}`)
})