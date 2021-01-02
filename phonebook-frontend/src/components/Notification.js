/* eslint-disable consistent-return */
/* eslint-disable no-global-assign */
import React from 'react';

export default Notification = ({ message, type }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const failedStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  if (message === null) return null;

  if (type === 'success') {
    return (
      <div style={successStyle} className="success-add">
        {message}
      </div>
    );
  } if (type === 'failed__delete') {
    return (
      <div style={failedStyle} className="failed-delete">
        {message}
      </div>
    );
  } if (type === 'failed__add') {
    return (
      <div style={failedStyle} className="failed-add">
        {message}
      </div>
    );
  }
};
