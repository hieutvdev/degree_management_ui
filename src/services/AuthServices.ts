import axios from "axios";
import { LoginModelRequest, RegisterModelRequest } from "../interfaces/Auth";
import { API_URL } from "../constants/api";
import TokenServices from "./TokenServices";
import { Notifications } from "@mantine/notifications";

const login = (payload: LoginModelRequest): Promise<any> => {
  return axios
    .post(`${API_URL}/auth/login`, payload)
    .then((res) => {
      if (res && res.data) {
        TokenServices.setUser(res.data.userDto);
        TokenServices.setToken(res.data.token);
      } else {
        Notifications.show({
          title: "Error",
          message: "Login failed",
          color: "red",
        });
      }

      return res.data;
    })
    .catch((error) => {
      Notifications.show({
        title: "Error",
        message: "Login failed",
        color: "red",
      });
    });
};

const register = (payload: RegisterModelRequest): Promise<any> => {
  return axios
    .post(`${API_URL}/auth/register`, payload)
    .then((res) => {
      if (res && res.data) {
        TokenServices.setUser(res.data.userDto);
        TokenServices.setToken(res.data.token);
      } else {
        Notifications.show({
          title: "Error",
          message: "Register failed",
          color: "red",
        });
      }

      return res.data;
    })
    .catch((error) => {
      Notifications.show({
        title: "Error",
        message: "Register failed",
        color: "red",
      });
    });
};

const AuthServices = {
  login,
  register,
};

export default AuthServices;
