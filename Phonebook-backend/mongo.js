const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide at least the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2];
const dbname = 'phonebook-app';
const url = 
  `mongodb+srv://fullstack:${password}@cluster0.fsm0d.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true, useUnifiedTopology: true, 
  useFindAndModify: false, useCreateIndex: true 
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// Save a person to db if name and number is included
const name = process.argv[3]; const number = process.argv[4];
if (process.argv.length > 3 && name && number) {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3 ) {
  Person.find({}).then((result) => {
    console.log('phonebook: ');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}