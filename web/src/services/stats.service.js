import axios from "axios";
import authHeader from "./auth-header";

const BASE_URL = import.meta.env.VITE_CLIENT_INVENTORY_API_URL;
const API_URL = BASE_URL + "/v1/stats";

const get = () => {
    return axios.get(API_URL, { headers: authHeader() });

};

const exportedObject = {
    get,
};

export default exportedObject;