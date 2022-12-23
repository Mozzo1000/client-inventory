import axios from "axios";
import authHeader from "./auth-header";

const BASE_URL = process.env.REACT_APP_CLIENT_INVENTORY_API_URL;
const API_URL = BASE_URL + "/v1/clients";

const getAll = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const get = (id) => {
    return axios.get(API_URL + "/" + id, { headers: authHeader() });

};

const getLatest = () => {
    return axios.get(API_URL + "/latest", { headers: authHeader() });

};

const exportedObject = {
    getAll,
    get,
    getLatest,
};

export default exportedObject;