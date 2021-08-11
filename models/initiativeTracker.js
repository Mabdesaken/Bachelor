const mongoose = require('mongoose')
const inventory = require('./invItem')

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

initiativeSchema.pre('remove', function(next) {
    inventory.find({ owner: this.id }, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('This author has books still'))
        } else {
            next()
        }
    })
})

let model = mongoose.model('Initiative', initiativeSchema)
module.exports = model