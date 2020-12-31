const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

console.log('Connecting...');


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then((result) => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  })

const personSchema = new mongoose.Schema({
  name: { 
    type: String, required:true, unique: true, minlength: 3
  },
  number: {
    type: String, required:true, unique: true, minlength: 8
  },
});

// Apply the uniqueValidator plugin to userSchema.
personSchema.plugin(uniqueValidator);

// Modifying objects format that Mongoose return
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Person', personSchema);