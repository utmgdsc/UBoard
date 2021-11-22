import axios, { AxiosInstance } from "axios";

export default class ServerApi {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: `api/v1` });
  }

  protected async post<Type>(path: string, form: Type) {
    try {
      const response = await this.api.post(path, form);
      return { response: response };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error };
      }
    }
  }

  async signUp(form: {
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return await this.post("/users/signup", form);
  }

  async signIn(form: { userName: string; password: string }) {
    return await this.post("/users/signin", form);
  }
}
