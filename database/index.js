const mongoose = require("mongoose");

async function connectDb() {
    return new Promise((resolve, reject) => {
        const url = "mongodb://127.0.0.1:27017/cultfit";
        mongoose.connect(url, (err) => {
            if (err) {
                return reject(err)
            }

            console.log("Database successfully connected.");
            return resolve()
        })
    })
}

module.exports = connectDb;