const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const childRoutes = require("./routes/child.routes");
const journalRoutes = require("./routes/journal.routes");
const routes = require("./routes/index.routes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};

connectDB();

app.use("/users", authRoutes);
app.use("/children", childRoutes);
app.use("/journal", journalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});