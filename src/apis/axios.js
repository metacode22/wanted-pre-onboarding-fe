import axios from 'axios';

const apiAddress = process.env.REACT_APP_API_ADDRESS;

export default axios.create({
    baseURL: apiAddress
})