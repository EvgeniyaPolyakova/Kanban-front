import makeRequest from "./makeRequest";

export const login = (data) => {
  return makeRequest.post("/auth/login", {
    email: data.login,
    password: data.password,
  });
};
