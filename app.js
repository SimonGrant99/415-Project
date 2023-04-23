const express = require("express")
const bodyParser = require("body-parser")
const { MongoClient } = require("mongodb")

const app = express()
const uri =
  "mongodb+srv://admin:415project@415-project.qf5zcil.mongodb.net/mydb?retryWrites=true&w=majority"

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

client.connect().then(() => {
  console.log("Connected to MongoDB")

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const db = client.db("415-Project")

  app.get("/rest/list", async (req, res) => {
    try {
      const docs = await db.collection("tickets").find().toArray()
      res.send(docs)
    } catch (err) {
      console.error(err)
      res.status(500).send("Error retrieving tickets")
    }
  })

  app.get("/rest/ticket/:id", async (req, res) => {
    const id = req.params.id
    try {
      const doc = await db
        .collection("tickets")
        .findOne({ _id: new MongoClient.ObjectId(id) })
      if (!doc) {
        res.status(404).send("Ticket not found")
      } else {
        res.send(doc)
      }
    } catch (err) {
      console.error(err)
      res.status(500).send("Error retrieving ticket")
    }
  })

  app.post("/rest/ticket", async (req, res) => {
    const ticket = req.body
    try {
      const result = await db.collection("tickets").insertOne(ticket)
      res.send(result.ops[0])
    } catch (err) {
      console.error(err)
      res.status(500).send("Error creating ticket")
    }
  })

  app.delete("/rest/ticket/:id", async (req, res) => {
    const id = req.params.id
    try {
      const result = await db
        .collection("tickets")
        .deleteOne({ _id: new MongoClient.ObjectId(id) })
      if (result.deletedCount === 0) {
        res.status(404).send("Ticket not found")
      } else {
        res.sendStatus(204)
      }
    } catch (err) {
      console.error(err)
      res.status(500).send("Error deleting ticket")
    }
  })

  app.put("/rest/ticket/:id", async (req, res) => {
    const id = req.params.id
    const updates = req.body
    try {
      const result = await db
        .collection("tickets")
        .updateOne({ _id: new MongoClient.ObjectId(id) }, { $set: updates })
      if (result.modifiedCount === 0) {
        res.status(404).send("Ticket not found")
      } else {
        const doc = await db
          .collection("tickets")
          .findOne({ _id: new MongoClient.ObjectId(id) })
        res.send(doc)
      }
    } catch (err) {
      console.error(err)
      res.status(500).send("Error updating ticket")
    }
  })

  app.get("/newticket", async (req, res) => {
    try {
      const result = await db.collection("tickets").insertOne(ticket)
      res.sendFile(__dirname + "/newticket.html")
    } catch (err) {
      console.error(err)
      res.status(500).send("Error creating ticket")
    }
  })

  const port = 3000
  app.listen(port, () => console.log(`Server started on port ${port}`))
})