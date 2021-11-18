import axios, { AxiosInstance } from 'axios';

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

  protected async get<Type>(path: string, params: Type | {} = {}) {
    try {
      const response = await this.api.get(path, {
        params,
      });
      return { response: response };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error };
      }
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
    return await this.get('/users/me');
  }

  async fetchRecentPosts(limit: number, offset: number) {
    return await this.get('/posts/', { limit, offset });
  }

  async fetchPost(postID: string) {
    return await this.get(`/posts/${postID}`);
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
}
