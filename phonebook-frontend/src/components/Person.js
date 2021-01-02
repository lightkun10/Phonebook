/* eslint-disable react/prop-types */
import React from 'react';

const Person = ({ name, number, deletePerson }) => (
  <div key={name}>
    {name} {number}
    <button type="button" onClick={deletePerson}>delete</button>
  </div>
);

export default Person;
