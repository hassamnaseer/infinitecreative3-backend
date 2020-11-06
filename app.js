const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const request = require("request");
const fs = require("fs");
const cors = require("cors");
const expressValidator = require("express-validator");

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const ordersRoutes = require("./routes/orders");

const store = process.env.STORE;
const api = process.env.API;
const password = process.env.PASSWORD;

app.get("/orders", (req, res) => {
	request(
		{
			url: `https://${api}:${password}@${store}?status=any&fields=created_at,id,email,name,currency,total-price,line_items,customer,financial_status`,
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				return res.status(500).json({ type: "error", message: error.message });
			}

			res.json(JSON.parse(body));
		},
	);
});

// api docs
app.get("/", (req, res) => {
	fs.readFile("docs/api-docs.json", (error, data) => {
		if (error) {
			res.status(400).json({
				error,
			});
		}
		const docs = JSON.parse(data);
		res.json(docs);
	});
});

app.get("/unilevel", (req, res) => {
	fs.readFile("docs/unilevel.json", (error, data) => {
		if (error) {
			res.status(400).json({
				error,
			});
		}
		const unilevel = JSON.parse(data);
		res.json(unilevel);
	});
});

app.get("/unilevel-criteria", (req, res) => {
	fs.readFile("docs/unilevel-criteria.json", (error, data) => {
		if (error) {
			res.status(400).json({
				error,
			});
		}
		const unilevelCriteria = JSON.parse(data);
		res.json(unilevelCriteria);
	});
});

dotenv.config();

// db connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Database Connected Successfully!"));

// db connection error handling
mongoose.connection.on("error", (err) => {
	console.log(`Database Connection Error: ${err.message}`);
});

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", ordersRoutes);
app.use(function (err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		res.status(401).json({ error: "Unauthorized User found!!" });
	}
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Node JS server is listening on port: ${port}`);
});
