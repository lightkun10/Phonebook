import React from 'react';

const Person = ({ name, number, deletePerson, }) => (
    <div key={name}>
      {name} {number} 
      <button onClick={deletePerson}>delete</button>
    </div>
  )

export default Person;