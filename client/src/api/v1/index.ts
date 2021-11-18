import axios, { AxiosInstance } from "axios";
import { UserAttributes } from "models/user";
import { Post } from "models/post";

export class ApiError extends Error {}

export default class ServerApi {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: `api/v1` });
  }

  protected async post<T, R>(
    path: string,
    form: T
  ): Promise<{ status: number; data?: R }> {
    try {
      const response = await this.api.post(path, form);
      return { status: response.status, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status as number,
          data: error.response?.data,
        };
      }
      throw new ApiError(`Could not post to path: ${path}`);
    }
  }

  async createPost(form: {
    title: string;
    body: string;
    file: string;
    tags: string;
    capacity: string;
    location: string;
  }) {
    return await this.post<typeof form, { result?: Post; message?: string }>(
      "/posts/",
      form
    );
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
