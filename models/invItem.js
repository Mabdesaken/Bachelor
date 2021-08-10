const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    weight: {
        type: Number,
        required: true
    },
    magical: {
        type: Boolean
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('invItem', itemSchema)