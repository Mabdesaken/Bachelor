const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    amount: {
        type: Number
    },
    magical: {
        type: Boolean
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('invItems', itemSchema)