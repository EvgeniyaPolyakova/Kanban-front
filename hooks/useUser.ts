import { useState } from "react";
import { LoginDto, RegisterDto } from "../api/dto/userDto";
import { register } from "../api/register";
import { login } from "../api/login";

export function useUser() {
  const [isEntered, setIsEntered] = useState(false);

  const getToken = async (data: RegisterDto) => {
    try {
      const token = await register(data);
      return token;
    } catch (e) {
      console.log(e);
    }
  };

  const enter = async (data: LoginDto) => {
    try {
      await login(data);
    } catch (e) {
      console.log(e);
    }
  };

  return { getToken, enter };
}
