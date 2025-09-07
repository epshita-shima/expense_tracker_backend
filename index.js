const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

// Schema
const expenseSchema = new mongoose.Schema({
  purpose: String,
  amount: Number,
  date: String, // yyyy-mm-dd
});

const Expense = mongoose.model("Expense", expenseSchema);

// Routes
app.post("/expenses", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json({ message: "Expense saved", expense: newExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Connected ✅");
});
app.listen(5000, () => console.log(`Server running on port ${PORT}`));
