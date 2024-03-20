import axios_ from "axios";
import { BASE_URL } from "./config";

const axios = axios_.create({
  baseURL: BASE_URL,
});

export default axios;
