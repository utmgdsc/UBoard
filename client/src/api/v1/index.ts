import axios, { AxiosInstance } from 'axios';

import { Post } from 'models/post';
import { User } from 'models/user';
import { UserAttributes } from 'models/user';

export type PostUser = Post & {
  User: { id: string; firstName: string; lastName: string };
};

export type PostUserPreview = {
  id: string;
  thumbnail: string;
  body: string;
  title: string;
  createdAt: string;
} & {
  User: { id: string; firstName: string; lastName: string };
};

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
      throw new ApiError(`Could not GET to path: ${path} due to ${error}`);
    }
  }

  protected async delete<ResponseDataType>(
    path: string
  ): Promise<{ status: number; data?: ResponseDataType }> {
    try {
      const response = await this.api.delete(path);
      return { status: response.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status as number,
          data: error.response?.data,
        };
      }
      throw new ApiError(`Could not DELETE ${path}`);
    }
  }

  protected async put<ResponseDataType>(
    path: string
  ): Promise<{ status: number; data?: ResponseDataType }> {
    try {
      const response = await this.api.put(path);
      return { status: response.status, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status as number,
          data: error.response?.data,
        };
      }
      throw new ApiError(`Could not PUT ${path}`);
    }
  }

  async deletePost(postID: string) {
    return await this.delete<{ message: string }>(`/posts/${postID}`);
  }

  async me() {
    return await this.get<{}, User>('/users/me', {});
  }

  async searchForPosts(query: string, limit: number, offset: number) {
    return await this.get<
      { query: string; limit: number; offset: number },
      {
        data: {
          result?: PostUserPreview[];
          count: number;
          total: number;
          message?: string;
        };
      }
    >('/posts/search', { query, limit, offset });
  }

  async fetchRecentPosts(limit: number, offset: number) {
    return await this.get<
      { limit: number; offset: number },
      {
        data: {
          result?: PostUserPreview[];
          count: number;
          total: number;
          message?: string;
        };
      }
    >('/posts/', { limit, offset });
  }

  async fetchPost(postID: string) {
    return await this.get<
      {},
      { data: { result?: PostUser }; message?: string }
    >(`/posts/${postID}`, {});
  }

  async createPost(form: {
    title: string;
    body: string;
    file: string;
    tags: string;
    capacity: number;
    location: string;
  }) {
    return await this.post<typeof form, { result?: Post; message?: string }>(
      '/posts/',
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
    return await this.post<typeof form, { message: string }>(
      '/users/signup',
      form
    );
  }

  async signOut() {
    return await this.post('/users/signout', {});
  }

  async likePost(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/upvote`);
  }

  async reportPost(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/report`);
  }

  async signIn(form: { userName: string; password: string }) {
    return await this.post<
      typeof form,
      { message: string; result?: UserAttributes }
    >('/users/signin', form);
  }
}
