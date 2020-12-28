import React from 'react';

const Form = ({ 
  addPerson, 
  newName, 
  handlePersonChange, 
  newNumber, 
  handleNumberChange 
}) => (
  <div className="form-section">
    <h2>add a new</h2>
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

export default Form;