const bcrypt = require('bcrypt');
const { run, all, get } = require('../utils/helper');

const getAllSales = async (req, res) => {
    const { id } = req.params

    try {
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

module.exports = { getAllSales }