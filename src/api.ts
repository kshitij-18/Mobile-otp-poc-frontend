import axios from 'axios';
import { NotFoundError } from './errors/NotFoundError';


export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 50000,
});


axiosInstance.interceptors.response.use((res) => res, (err) => {
    if (err.response) {
        console.log('ERROR', err);
        let error = err;
        const { status } = err.response;
        if (status === 404) {
            error = new NotFoundError({ code: 404, message: err.response.message });
        }
        return Promise.reject(error);
    }
})

