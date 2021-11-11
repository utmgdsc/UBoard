import axios from "axios";

export const api_v1 = axios.create({ baseURL: `api/v1` });
