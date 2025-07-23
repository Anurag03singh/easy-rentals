import axios from "axios";
import config from "../config.js";

const apiRequest = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

export default apiRequest;