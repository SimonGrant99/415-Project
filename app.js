const mongodb = require('mongodb')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const MongoClient = mongodb.MongoClient
const uri = 'mongodb+srv://admin:415project@415-project.qf5zcil.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.json())

client.connect((err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log('Connected to MongoDB')

const db = client.db('415-Project')

//Start of Endpoints
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const tickets = [{
        id: 1,
        title: 'Ticket 1',
        description: 'Description 1'
    },
    {
        id: 2,
        title: 'Ticket 2',
        description: 'Description 2'
    },
    {
        id: 3,
        title: 'Ticket 3',
        description: 'Description 3'
    },
]

app.get('/rest/list', function(req, res) {
    db.collection('tickets').find().toArray((err, docs) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error retrieving tickets')
          return
        }
        res.send(docs)
    })
})

app.get('/rest/ticket/:id', function(req, res) {
    const id = req.params.id
    db.collection('tickets').findOne({ _id: new mongodb.ObjectId(id) }, (err, doc) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error retrieving ticket')
          return
        }
        if (!doc) {
          res.status(404).send('Ticket not found')
          return
        }
        res.send(doc)
    })
})

app.post('/rest/ticket', function(req, res) {
    const ticket = req.body
    db.collection('tickets').insertOne(ticket, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Error creating ticket')
        return
      }
      res.send(result.ops[0])
    })
})

app.delete('/rest/ticket/:id', function(req, res) {
    const id = req.params.id
    db.collection('tickets').deleteOne({ _id: new mongodb.ObjectId(id) }, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Error deleting ticket')
        return
      }
      if (result.deletedCount === 0) {
        res.status(404).send('Ticket not found')
        return
      }
      res.sendStatus(204)
    })
})

app.put('/rest/ticket/:id', function(req, res) {
    const id = req.params.id
    const updates = req.body
    db.collection('tickets').updateOne({ _id: new mongodb.ObjectId(id) }, { $set: updates }, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Error updating ticket')
        return
      }
      if (result.modifiedCount === 0) {
        res.status(404).send('Ticket not found')
        return
      }
      db.collection('tickets').findOne({ _id: new mongodb.ObjectId(id) }, (err, doc) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error retrieving updated ticket')
          return
        }
        res.send(doc)
      })
    })
})

app.get('/newticket', function(req, res) {
    db.collection('tickets').insertOne(ticket, (err, result) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error creating ticket')
          return
        }
        res.sendFile(__dirname + '/newticket.html')
    })
})

const port = 3000
app.listen(port, function() {
    console.log(`Server started on port ${port}`)
})
})