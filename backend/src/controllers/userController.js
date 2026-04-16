const express = require('express')
const db = require('../database')
const { run, all, get } = require('../utils/helper')
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body
        if(!email || !password || !name) {
            return res.status(400).json({success:false,data:"All fields are required."})
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if(err) {
                return res.status(500).json({success:false,data:`Error hashing password: ${err.message}`})
            }

            const query = `
                INSERT INTO users (email, password_hash, name)
                VALUES (?, ?, ?)
            `

            const params = [email, hash, name]

            db.run(query, params, function(err) {
                if(err) {
                    return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
                } else {
                    return res.status(200).json({success:true,data:{
                        id: this.lastID,
                        name: name,
                        email: email
                    }})
                }
            })
        })
    } catch(err) {
        return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
    }
}

const login = async (req, res) => {};

// const getAllStudent = async (req, res) => {
//     try {
//         const query = `
//             SELECT * FROM students
//         `
        
//         const result = await all(query, [])
//         return res.status(200).json({success:true,data:result})
//     } catch(err) {
//         return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
//     }
// }

// const updateStudent = async (req, res) => {
//     try {
//         const { id } = req.params
//         const { name, age, grade } = req.body
//         const query = `
//             UPDATE students
//             SET
//                 name = COALESCE(?, name),
//                 age = COALESCE(?, age),
//                 grade = COALESCE(?, grade)
//             WHERE id = ?
//         `
//         const params = [name, age, grade, id]

//         const result = await run(query, params)
//         return res.status(200).json({success:true,data:{ id: Number(req.params.id), name, age, grade }})
//     } catch(err) {
//         return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
//     }
// }

// const deleteStudent = async (req, res) => {
//     try {
//         const { id } = req.params
//         const query = `
//             DELETE FROM students WHERE id = ?
//         `
//         const params = [id]

//         const result = await run(query, params)
//         return res.status(200).json({success:true,data:`Student deleted successfully!: ${result.lastID}`})
//     } catch(err) {
//         return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
//     }
// }

module.exports = { registerUser }