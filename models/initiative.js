const mongoose = require('mongoose')

const initiativeSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Initiative', initiativeSchema)