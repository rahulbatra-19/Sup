import axios_ from "axios";
import { BASE_URL } from "./config";

const axios = axios_.create({
  baseURL: BASE_URL,
  //   headers: {
  //     // "Content-Type": "application/json",
  //     "x-auth-token": localStorage.getItem("x-auth-token"),
  //     // lowercase because headers are automtically turned to lower case
  //     workspaceid:
  //       localStorage.getItem("workspaceid") ||
  //       JSON.parse(localStorage.getItem("owner") || "{}")?.workSpaces?.[0]
  //         ?.workSpaceId,
  //   },
});

export default axios;
