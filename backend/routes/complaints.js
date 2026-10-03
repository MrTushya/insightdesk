const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Create a complaint
router.post("/", async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            title,
            description,
            category,
            priority
        } = req.body;

        if (!customer_name || !title || !description) {
            return res.status(400).json({
                message: "Customer name, title and description are required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO complaints
            (customer_name, customer_email, title, description, category, priority)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                customer_name,
                customer_email || null,
                title,
                description,
                category || "Uncategorized",
                priority || "Medium"
            ]
        );

        res.status(201).json({
            message: "Complaint created successfully",
            complaintId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create complaint"
        });
    }
});

// Get all complaints
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM complaints ORDER BY created_at DESC"
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch complaints"
        });
    }
});

// Update complaint status
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const allowedStatuses = ["Open", "In Progress", "Resolved"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const [result] = await db.execute(
            "UPDATE complaints SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint status updated successfully",
            complaintId: id,
            status: status
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update complaint status"
        });
    }
}); 

module.exports = router;