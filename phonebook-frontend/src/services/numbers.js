import axios from 'axios';
// const baseUrl = 'http://localhost:3001/api/persons';
const baseUrl = '/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
}

const deleteNumber = (id) => axios.delete(`${baseUrl}/${id}`);

const update = (updatePerson) => {  
  const request = axios.put(`${baseUrl}/${updatePerson.id}`, updatePerson);
  return request.then((response) => response.data);
}

export default { getAll, create, deleteNumber, update, };