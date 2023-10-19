const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.huafxe1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const carCollection = client.db("carDB").collection("cars");

    // posting single data to database
    app.post("/cars", async (req, res) => {
      const car = req.body;
      const result = await carCollection.insertOne(car);
      res.send(result);
    });

    // get single data
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await carCollection.findOne(query);
      res.send(result);
    });
    // update data
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {
        _id: new ObjectId(id),
      };
      const options = { upsert: true };
      const update = {
        $set: {
          image: data.image,
          name: data.name,
          price: data.price,
          description: data.description,
          brand: data.brand,
          type: data.type,
          rating: data.rating,
        },
      };
      const result = await carCollection.updateOne(filter, update, options);
      res.send(result);
    });
    // geting data from database
    app.get("/cars", async (req, res) => {
      const result = await carCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("GearIQ server is running....");
});

app.listen(port, () => {
  console.log(`GearIQ server is running on port : ${port}`);
});
