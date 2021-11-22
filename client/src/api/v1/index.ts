import axios, { AxiosInstance } from 'axios';

import { UserAttributes } from 'models/user';

export class ApiError extends Error {}

export default class ServerApi {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: `api/v1` });
  }

  protected async post<RequestDataType, ResponseType>(
    path: string,
    form: RequestDataType
  ): Promise<{ status: number; data: ResponseType }> {
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

  async signUp(form: {
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return await this.post<typeof form, { message: string }>(
      '/users/signup',
      form
    );
  }

  async signIn(form: { userName: string; password: string }) {
    return await this.post<
      typeof form,
      { message: string; result?: UserAttributes }
    >('/users/signin', form);
  }
}
