const bcrypt = require('bcrypt');
const { run, all, get } = require('../utils/helper');

const getAllSales = async (req, res) => {
    try {
        const { id } = req.params

        const query = `
            SELECT id, amount, description, date FROM sales
            WHERE id = ?
        `
        const params = [id]

        const result = await all(query, params)

        res.status(200).json({success:true,message:"Fetched all sales successfully.",data:result})
    } catch(err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

const createSale = async (req, res) => {
    try {
        let { user_id, amount, description, date } = req.body

        if(!amount) {
            return res.status(400).json({success:false,message:"Amount required."})
        }

        amount = Number(amount)
        if(amount < 1) {
            return res.status(400).json({success:false,message:"Amount cannot be negative."})
        }

        if(!date) {
            date = new Date().toLocaleString()
        }

        // Check if user exists
        const user = await get(`SELECT * FROM users WHERE id = ?`, [user_id]);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid user." });
        }

        const query = `
            INSERT INTO sales (user_id, amount, description, date)
            VALUES (?, ?, ?, ?)
        `
        const params = [user_id, amount, description, date]

        const result = await run(query, params)
        res.status(200).json({success:true,message:"Sale created successfully"})
    } catch(err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

const deleteSale = async (req, res) => {
    try {
        const { id } = req.params
        let { user_id  } = req.body

        // Check if user exists
        const user = await get(`SELECT * FROM users WHERE id = ?`, [user_id]);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid user." });
        }

        const query = `
            DELETE FROM sales
            WHERE id = ? AND user_id = ?
        `
        const params = [id, user_id]

        const result = await run(query, params)
        if(result.changes === 0) {
            return res.status(404).json({success:false,message:`Sale record not found.`})
        }

        res.status(200).json({success:true,message:"Sale deleted successfully"})
    } catch(err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

module.exports = { getAllSales, createSale, deleteSale }