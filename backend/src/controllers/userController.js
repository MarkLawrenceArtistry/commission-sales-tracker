const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, all, get } = require('../utils/helper');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // 2. Check if user exists
        const user = await get(`SELECT * FROM users WHERE email = ?`, [email]);
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // 3. Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET, 
            { expiresIn: '8h' } // Token expires in 8 hours (typical work shift)
        );

        // 5. Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            data: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // 1. Validation
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // 2. Check if user exists
        const user = await get(`SELECT * FROM users WHERE email = ?`, [email]);
        if (user) {
            return res.status(401).json({ success: false, message: "Email already taken." });
        }

        // 3. Hash the password
        const hash = bcrypt.hashSync(password, 10);

        // 4. Insert the account
        const query = `
            INSERT INTO users (email, password_hash, name)
            VALUES (?, ?, ?)
        `
        const params = [email, hash, name]
        const result = await run(query, params)
        
        // 5. Response
        res.status(200).json({
            success: true,
            message: "Register successful",
            data: {
                id: result.lastID,
                email: email,
                name: name
            }
        });

    } catch(err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

const checkSession = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
}

const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT * FROM users
        `

        const result = await all(query)

        res.status(200).json({success:true,message:"Fetched all users successfully.",data:result})
    } catch(err) {
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
}

module.exports = { login, register, checkSession, getAllUsers };