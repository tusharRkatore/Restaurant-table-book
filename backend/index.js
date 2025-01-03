require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const bookRouter = require("./routes/router");
const seedDatabase = require("./routes/seedDataforSlot");

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

seedDatabase();

app.use("/", bookRouter);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
