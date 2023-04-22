const express = require('express')
const bodyParser = require('body-parser')

//Pre-Baked Code to Confirm Connection to MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:415project@415-project.qf5zcil.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

//Start of Endpoints
const app = express()
app.use(bodyParser.json())

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
    res.json(tickets)
})

app.get('/rest/ticket/:id', function(req, res) {
    const id = parseInt(req.params.id)
    const ticket = tickets.find(function(t) {
        return t.id === id
    })
    if (!ticket) {
        res.status(404).send('Ticket not found')
    } else {
        res.json(ticket)
    }
})

app.post('/rest/ticket', function(req, res) {
    const ticket = req.body
    ticket.id = tickets.length + 1
    tickets.push(ticket)
    res.json(ticket)
})

app.delete('/rest/ticket/:id', function(req, res) {
    const id = parseInt(req.params.id)
    const index = tickets.findIndex(function(t) {
        return t.id === id
    })
    if (index === -1) {
        res.status(404).send('Ticket not found')
    } else {
        tickets.splice(index, 1)
        res.sendStatus(204)
    }
})

app.put('/rest/ticket/:id', function(req, res) {
    const id = parseInt(req.params.id)
    const index = tickets.findIndex(function(t) {
        return t.id === id
    })
    if (index === -1) {
        res.status(404).send('Ticket not found')
    } else {
        const updatedTicket = req.body
        updatedTicket.id = id
        tickets[index] = updatedTicket
        res.json(updatedTicket)
    }
})

app.get('/newticket', function(req, res) {
    res.sendFile(__dirname + '/newticket.html')
})

const port = 3000
app.listen(port, function() {
    console.log(`Server started on port ${port}`)
})