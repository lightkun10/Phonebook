import React, { useState, useEffect } from 'react'
import Header from './components/Header';
import Filter from './components/Filter';
import Form from './components/Form';
import Result from './components/Result';
import Notification from './components/Notification';
import numberService from './services/numbers';

const App = () => {
  const [ persons, setPersons ] = useState([]);
  
  // Control the form input element
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    const eventHandler = (initialNotes) => {
      console.log('promise fulfilled');
      setPersons(initialNotes);
    }

    const errorHandler = (error) => {
      console.log('Promise rejected');
      alert(error);
    }

    numberService.getAll()
      .then(eventHandler)
      .catch(errorHandler);
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const person = persons.find((person) => person.name === newName);
    const newPerson = { 
      name: newName,
      number: newNumber, 
    };

    // If the same name already exist,
    if (person) {
      // If the number are different, ask if user want to change
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatePerson = { ...person, number: newNumber };
        numberService.update(updatePerson)
          .then((returnedPerson) => {
            // console.log(returnedPerson);
            setPersons(persons.map((person) => person.id !== returnedPerson.id ? person : returnedPerson));
          })
          .catch((error) => {
            console.log('An error occured\n', error)
            setMessageType('failed__delete');
            setMessage(`Information of ${updatePerson.name} has already been removed from server`);
            setTimeout(() => {
              setMessage(null);
              setMessageType(null);
            }, 4000)
          });
        setNewName('');
        setNewNumber('');
      }
    } else {
      numberService
        .create(newPerson)
        .then((returnedPerson) => {
          // If promise for adding person fulfilled, 
          // show the success message.
          setMessageType('success');
          setMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setMessage(null);
          }, 4000);

          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          console.log('Promise rejected');
          alert(error);
        });
    }
  }

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      console.log(`deleting ${person.name}...`);

      numberService.deleteNumber(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => console.log('An error occured', error));
    }
  }

  // Filter for person names
  const filtered = !searchTerm 
    ? persons 
    : persons.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value);
  }

  return (
    <div>
      <Header text='Phonebook' />

      <Notification message={message} type={messageType} />

      <Filter searchTerm={searchTerm} handleFilterChange={handleFilterChange} />

      <Form
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <Result filtered={filtered} deletePerson={deletePerson} />
    </div>
  )
}

export default App