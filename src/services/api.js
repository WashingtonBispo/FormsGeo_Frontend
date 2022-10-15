import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7130/api/",
});

export { api };
