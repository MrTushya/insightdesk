const express = require("express");
const cors = require("cors");
require("dotenv").config();

const complaintRoutes = require("./routes/complaints");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "InsightDesk API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "InsightDesk Backend"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`InsightDesk server running on port ${PORT}`);
});