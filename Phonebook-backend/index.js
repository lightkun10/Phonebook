const express = require('express');
const app = express();
const { performance } = require('perf_hooks');
const morgan = require('morgan');
const cors = require('cors');

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
  res.json(phonebook['persons']);
});

app.get('/info', (req, res) => {
  let count = phonebook.persons.length;

  res.send(`
    Phonebook has info for ${count} people
    <br></br>
    ${new Date()}
  `
  )
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = phonebook.persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  phonebook.persons = phonebook.persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  // https://gist.github.com/gordonbrander/2230317
  // return Math.random().toString(36).substr(2, 9);
  // return Math.random().toString().slice(2).substring(0, 9) + Date.now();
  return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
}

app.post('/api/persons', (req, res) => {
  const body = req.body;

  const personDbName = phonebook.persons.find((person) => person.name === body.name);

  if (personDbName) {
    return res.status(400).json({
      error: "Name must be unique."
    })
  }
  else if (!body) {
    return res.status(400).json({
      error: "Content missing. Must provide name and number."
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  phonebook.persons = phonebook.persons.concat(person);
  console.log(person);
  // console.log(phonebook);
  res.json(body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});