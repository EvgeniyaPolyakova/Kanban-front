import axios from "axios";

const makeRequest = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

export default makeRequest;
