import axios from "axios";
import { ServerUrl } from "../App";

const api = axios.create({
  baseURL: `${ServerUrl}/api`,
  withCredentials: true,
});

export default api;
