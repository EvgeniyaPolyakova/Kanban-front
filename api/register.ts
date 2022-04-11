import { RegisterDto } from "./dto/userDto";
import makeRequest from "./makeRequest";

export const register = (data: RegisterDto) => {
  return makeRequest.post("/auth/registration", {
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
  });
};
