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
        const { id } = req.params
        let { amount, description, date } = req.body

        if(!amount || !description || !date) {
            return res.status(400).json({success:false,message:"All fields required."})
        }

        amount = Number(amount)
        if(amount < 1) {
            return res.status(400).json({success:false,message:"Amount cannot be negative."})
        }

        // Check if user exists
        const user = await get(`SELECT * FROM users WHERE id = ?`, [id]);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid user." });
        }

        const query = `
            INSERT INTO sales (user_id, amount, description, date)
            VALUES (?, ?, ?, ?)
        `
        const params = [id, amount, description, date]

        const result = await run(query, params)
        res.status(200).json({success:true,message:"Sale created successfully"})
    } catch(err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

module.exports = { getAllSales, createSale }