const MongoClient = require("mongodb").MongoClient
const uri =
	"mongodb+srv://admin:415project@415-project.qf5zcil.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
client.connect((err) => {
	if (err) {
		console.error(err)
		return
	}
	console.log("Connected to MongoDB")

	const db = client.db("my-database")

	app.get("/rest/list", function (req, res) {
		db
			.collection("tickets")
			.find()
			.toArray(function (err, docs) {
				if (err) {
					console.error(err)
					res.status(500).send("Error retrieving tickets")
					return
				}
				res.send(docs)
			})
	})

	app.get("/rest/ticket/:id", function (req, res) {
		const id = req.params.id
		db
			.collection("tickets")
			.findOne({ _id: new mongodb.ObjectId(id) }, function (err, doc) {
				if (err) {
					console.error(err)
					res.status(500).send("Error retrieving ticket")
					return
				}
				if (!doc) {
					res.status(404).send("Ticket not found")
					return
				}
				res.send(doc)
			})
	})

	app.post("/rest/ticket", function (req, res) {
		const ticket = req.body
		db.collection("tickets").insertOne(ticket, function (err, result) {
			if (err) {
				console.error(err)
				res.status(500).send("Error creating ticket")
				return
			}
			res.send(result.ops[0])
		})
	})

	app.delete("/rest/ticket/:id", function (req, res) {
		const id = req.params.id
		db
			.collection("tickets")
			.deleteOne({ _id: new mongodb.ObjectId(id) }, function (err, result) {
				if (err) {
					console.error(err)
					res.status(500).send("Error deleting ticket")
					return
				}
				if (result.deletedCount === 0) {
					res.status(404).send("Ticket not found")
					return
				}
				res.sendStatus(204)
			})
	})

	app.put("/rest/ticket/:id", function (req, res) {
		const id = req.params.id
		const updates = req.body
		db
			.collection("tickets")
			.updateOne(
				{ _id: new mongodb.ObjectId(id) },
				{ $set: updates },
				function (err, result) {
					if (err) {
						console.error(err)
						res.status(500).send("Error updating ticket")
						return
					}
					if (result.modifiedCount === 0) {
						res.status(404).send("Ticket not found")
						return
					}
					db
						.collection("tickets")
						.findOne({ _id: new mongodb.ObjectId(id) }, function (err, doc) {
							if (err) {
								console.error(err)
								res.status(500).send("Error retrieving updated ticket")
								return
							}
							res.send(doc)
						})
				}
			)
	})
})