import axios from "axios";

const BASE_URL = import.meta.env.VITE_CLIENT_INVENTORY_API_URL;
const API_URL = BASE_URL + "/v1/auth/";

const register = (email, name, password) => {
    return axios.post(API_URL + "register", {
        email,
        name,
        password,
    });
};

const login = (email, password) => {
    return axios
        .post(API_URL + "login", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const exportedObject = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default exportedObject;