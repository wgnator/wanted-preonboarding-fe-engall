import axios from "axios";
import { HttpRequest } from "../http-common";

const service = axios.create({
  baseURL: "http://localhost:8000/users",
  headers: {
    "Content-type": "application/json",
  },
});

export default new HttpRequest(service);
