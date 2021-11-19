import axios, { AxiosInstance } from 'axios';
import { Post } from 'models/post';
import { User } from 'models/user';

export type PostUser = Post & {
  User: { id: string; firstName: string; lastName: string };
};

export class ApiError extends Error {}

export type APIResponse<T> = { status: number; data?: T };

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

  protected async get<RequestDataType, ResponseType>(
    path: string,
    params: RequestDataType
  ): Promise<{ status: number; data?: ResponseType }> {
    try {
      const response = await this.api.get(path, {
        params,
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status as number,
          data: error.response?.data,
        };
      }
      throw new ApiError(`Could not GET to path: ${path}`);
    }
  }

  protected async delete(path: string) {
    try {
      const response = await this.api.delete(path);
      return { response: response };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error };
      }
    }
  }

  async deletePost(postID: string) {
    return await this.delete(`/posts/${postID}`);
  }

  async me() {
    return await this.get<{}, User>('/users/me', {});
  }

  async fetchRecentPosts(limit: number, offset: number) {
    return await this.get<
      { limit: number; offset: number },
      { data: { result?: PostUser[]; count: number } }
    >('/posts/', { limit, offset });
  }

  async fetchPost(postID: string) {
    return await this.get<{}, { result?: PostUser; message?: string }>(
      `/posts/${postID}`,
      {}
    );
  }

  async signUp(form: {
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return await this.post('/users/signup', form);
  }

  async signIn(form: { userName: string; password: string }) {
    return await this.post('/users/signin', form);
  }

  async signOut() {
    return await this.post('users/signout', {});
  }
}
