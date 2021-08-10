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
let model = mongoose.model('Initiative', initiativeSchema)
module.exports = model