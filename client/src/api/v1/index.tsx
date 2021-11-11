import axios, { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";

export default class ServerApi {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: `api/v1` });
  }

  async signUp(form: {
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      await this.api.post("/users/signup", form);
      window.alert("Email confirmation sent!");
    } catch (error: any) {
      if (error.response) {
        const msg = error.response.data.message;
        console.error(msg);
        window.alert(`Message: ${msg}`);
      }
    }
  }

  async signIn(
    form: { userName: string; password: string },
    navigate: NavigateFunction,
    from: string
  ) {
    try {
      await this.api.post("/users/signin", form);
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.response) {
        const msg = error.response.data.message;
        console.error(msg);
        window.alert(`Message: ${msg}`);
      }
    }
  }
}
