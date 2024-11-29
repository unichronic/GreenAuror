const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

// Connect to the "petitions" MongoDB
mongoose
  .connect("mongodb://localhost:27017/petitions", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to petitions MongoDB"))
  .catch((err) => console.error("Could not connect to petitions MongoDB:", err));

// Connect to the "donations" MongoDB using createConnection
const donationDb = mongoose.createConnection("mongodb://localhost:27017/donations", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

donationDb.on('connected', () => {
  console.log("Connected to donations MongoDB");
});

donationDb.on('error', (err) => {
  console.error("Could not connect to donations MongoDB:", err);
});

// Define the Petition schema and model
const petitionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const Petition = mongoose.model("Petition", petitionSchema);

// Define the Donation schema and model for donations database
const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
});

const Donation = donationDb.model("Donation", donationSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API endpoint to handle petition signups
app.post("/api/add-petition", async (req, res) => {
  try {
    const { email, firstName, lastName, country, postalCode } = req.body;

    // Check if the user is already registered
    const existingUser = await Petition.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User is already registered!" });
    }

    // Add a new user
    const newPetition = new Petition({ email, firstName, lastName, country, postalCode });
    await newPetition.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// API endpoint to handle donations
app.post("/donate", async (req, res) => {
    try {
      const { amount } = req.body;
  
      // Validate the donation amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid donation amount." });
      }
  
      // Create a new donation record
      const newDonation = new Donation({ amount });
      await newDonation.save();
  
      res.status(201).json({ message: "Donation received!" });
    } catch (err) {
      console.error("Error processing donation:", err);
      res.status(500).json({ message: "Error processing donation." });
    }
  });

// API endpoint to get the total amount donated
app.get("/total-donated", async (req, res) => {
    try {
      const totalDonations = await Donation.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
  
      res.status(200).json({ total: totalDonations[0] ? totalDonations[0].total : 0 });
    } catch (err) {
      console.error("Error fetching total donations:", err);
      res.status(500).json({ message: "Error fetching total donations." });
    }
  });
// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
