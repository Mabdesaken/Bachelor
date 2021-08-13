const mongoose = require('mongoose')
const inventory = require('./invItem')

const initiativeSchema = mongoose.Schema({
    //information needed to create an object from the model
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

//runs this function every time someone tries to delete a player from the initiative tracker. If there are items referencing this object we do not want to
//remove it, as it creates a lot of references to ojects that don't exist anymore
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

//send the model to exports for backend logic
let model = mongoose.model('Initiative', initiativeSchema)
module.exports = model