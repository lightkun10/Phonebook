/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');

const app = express();
const { performance } = require('perf_hooks');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

app.use(cors());

app.get('/', (req, res) => {
  res.send('Phonebook');
});

app.get('/api/persons', (req, res, next) => {
  // res.json(phonebook['persons']);
  Person.find({}).then((people) => {
    res.json(people);
  }).catch((error) => {
    next(error);
  });
});

app.get('/info', (req, res) => {
  let count;
  Person.find({})
    .then((result) => {
      res.send(`
        Phonebook has info for ${result.length} people
        <br></br>
        ${new Date()}
      `);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id);
  Person.findById(req.params.id)
    .then((p) => {
      if (p) {
        res.json(p);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// https://gist.github.com/gordonbrander/2230317
// return Math.random().toString(36).substr(2, 9);
// return Math.random().toString().slice(2).substring(0, 9) + Date.now();
const generateId = () => (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, '');

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      res.json(savedAndFormattedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;

  if (body.number.split('').filter((num) => num >= '0' && num <= 9)
    .length < 8) {
    return next({
      name: 'ValidationError',
      message: 'number must be at least 8 digits.',
    });
  }

  const updatePerson = { number: body.number };

  Person.findByIdAndUpdate(req.params.id, updatePerson, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// eslint-disable-next-line spaced-comment
/********************
*** Middlewares
*********************/

// handler of requests with unknown endpoint
const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndPoint);

// handler of requests with result to errors
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
