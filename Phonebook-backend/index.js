require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');
const { performance } = require('perf_hooks');
const morgan = require('morgan');
const cors = require('cors');
const { response } = require('express');

app.use(express.json());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(cors());


let phonebook = {
  "persons": [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    },
  ]
}

app.get('/', (req, res) => {
  res.send('Phonebook');
})

app.get('/api/persons', (req, res) => {
  // res.json(phonebook['persons']);
  Person.find({}).then((people) => {
    res.json(people);
  })
});

app.get('/info', (req, res) => {
  let count;
  Person.find({})
    .then((result) => {
      res.send(`
        Phonebook has info for ${result.length} people
        <br></br>
        ${new Date()}
      `
      )
    });
});

app.get('/api/persons/:id', (req, res) => {
  // const id = Number(req.params.id);

  Person.findById(req.params.id).then((p) => {
    res.json(p);
  })
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  // https://gist.github.com/gordonbrander/2230317
  // return Math.random().toString(36).substr(2, 9);
  // return Math.random().toString().slice(2).substring(0, 9) + Date.now();
  return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  // console.log(body);
  Person.find({ name: body.name })
    .then((result) => {
      if (result.length > 0) {
        // console.log("Duplicate name on db, updating number...");
        Person.findOneAndUpdate({ name: body.name }, { number: body.number })
          .then((result) => {
            res.status(200).send(`Updated ${result.name}'s number`).end();
          })
          .catch((error) => next(error));
      }
      else {
        // console.log("Create new entry number...");
        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person.save().then((savedPerson) => {
          res.json(savedPerson);
        })
      }
    });
});

/********************
*** Middlewares 
*********************/

// handler of requests with unknown endpoint
const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndPoint);

// handler of requests with result to errors
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error) {
    return response.status(400).send({ error: 'something wrong happened.' });
  }

  next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});