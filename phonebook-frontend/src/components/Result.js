import React from 'react';
import Person from './Person';

const Result = ({ filtered, deletePerson }) => {
  return (
    <div className="result-section">
      <h2>Numbers</h2>
        {filtered.map((person) =>
          <Person
            key={person.name}
            name={person.name} 
            number={person.number}
            deletePerson={() => deletePerson((person.id))} />
        )}
    </div>
  )
}

export default Result;