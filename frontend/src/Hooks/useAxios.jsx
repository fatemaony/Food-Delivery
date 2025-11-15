import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://food-delivery-app-dusky-eight.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;