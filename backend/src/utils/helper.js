const express = require('express');
const db = require('../database');

const get = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if(err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

const run = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if(err) {
                reject(err)
            } else {
                resolve(this)
            }
        })
    })
}

const all = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if(err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

module.exports = { run, all, get }