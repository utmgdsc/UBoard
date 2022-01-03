import axios, { AxiosInstance } from 'axios';

import { Post } from 'models/post';
import { User } from 'models/user';
import { Comment } from 'models/comment';
import { UserAttributes } from 'models/user';
import { PostTag } from 'models/PostTags';

export type CommentsUser = Comment & {
  User: {
    firstName: string;
    lastName: string;
    id: string;
  };
  createdAt: string;
};

export type PostUser = Post & {
  type: string;
  likeCount: number;
  doesUserLike: string;
  didUserReport: string;
  createdAt: string;
  UserId: string;
  isUserCheckedIn: string;
  usersCheckedIn: number;
  User: { firstName: string; lastName: string };
  Tags: {
    text: string & { PostTags: PostTag }; // sequelize pluarlizes name
  }[];
};

export type PostUserPreview = {
  type: string;
  id: string;
  thumbnail: string;
  body: string;
  title: string;
  createdAt: string;
  likeCount: number;
  doesUserLike: string;
  isUserCheckedIn: string;
  usersCheckedIn: number;
  capacity: number;
  totalComments: number;
} & {
  Tags: {
    text: string & { PostTags: PostTag }; // sequelize pluarlizes name
  }[];
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
  ): Promise<{ status: number; data?: ResponseDataType }>;
  protected async put<RequestDataType, ResponseDataType>(
    path: string,
    form: RequestDataType
  ): Promise<{ status: number; data?: ResponseDataType }>;
  protected async put<RequestDataType, ResponseDataType>(
    path: string,
    form?: RequestDataType
  ): Promise<{ status: number; data?: ResponseDataType }> {
    try {
      let response;
      if (form) {
        response = await this.api.put(path, form);
      } else {
        response = await this.api.put(path);
      }
      if (!response.data) {
        return { status: response.status };
      }
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

  async searchForPosts(
    type: string,
    query: string,
    limit: number,
    offset: number
  ) {
    return await this.get<
      { type: string; query: string; limit: number; offset: number },
      {
        data: {
          result?: PostUserPreview[];
          count: number;
          total: number;
          message?: string;
        };
      }
    >('/posts/search', { type, query, limit, offset });
  }

  async fetchUserPosts(
    userId: string,
    type: string,
    limit: number,
    offset: number
  ) {
    return await this.get<
      { type: string; limit: number; offset: number },
      {
        data: {
          result?: PostUserPreview[];
          count: number;
          total: number;
          message?: string;
        };
      }
    >(`/posts/user/${userId}`, { type, limit, offset });
  }

  async fetchRecentPosts(type: string, limit: number, offset: number) {
    return await this.get<
      { type: string; limit: number; offset: number },
      {
        data: {
          result?: PostUserPreview[];
          count: number;
          total: number;
          message?: string;
        };
      }
    >('/posts/', { type, limit, offset });
  }

  async fetchPost(postID: string) {
    return await this.get<
      {},
      { data: { result?: PostUser }; message?: string }
    >(`/posts/${postID}`, {});
  }

  async likePost(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/upvote`);
  }

  async unlikePost(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/downvote`);
  }

  async reportPost(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/report`);
  }

  async checkin(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/checkin`);
  }

  async checkout(postID: string) {
    return await this.put<{ status: number }>(`/posts/${postID}/checkout`);
  }

  async createPost(form: {
    type: string;
    title: string;
    body: string;
    file?: File;
    tags: string[];
    capacity: number;
    location: string;
    coords?: { lat: number; lng: number };
  }) {
    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('title', form.title);
    formData.append('body', form.body);
    form.tags.forEach((tag) => formData.append('tags[]', tag));
    formData.append('capacity', String(form.capacity));
    formData.append('location', form.location);
    formData.append('coords', JSON.stringify(form.coords));

    if (form.file) {
      formData.append('file', form.file);
    }

    return await this.post<
      typeof formData,
      { result?: Post; message?: string }
    >('/posts/', formData);
  }

  async updatePost(
    postID: string,
    form: {
      title: string;
      body: string;
      location: string;
      capacity: number;
      coords?: { lat: number; lng: number };
    }
  ) {
    return await this.put<typeof form, { result?: Post; message?: string }>(
      `/posts/${postID}`,
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

  async signIn(form: { userName: string; password: string }) {
    return await this.post<
      typeof form,
      { message: string; result?: UserAttributes }
    >('/users/signin', form);
  }

  async signOut() {
    return await this.post('/users/signout', {});
  }

  async requestPasswordReset(form: { email: string }) {
    return await this.post<typeof form, { message: string }>(
      '/users/request-password-reset',
      form
    );
  }

  async confirmEmail(form: { token: string }) {
    return await this.put<typeof form, { message: string }>(
      '/users/confirm-email',
      form
    );
  }

  async resetPass(form: {
    token: string;
    password: string;
    confirmPassword: string;
  }) {
    return await this.put<typeof form, { message: string }>(
      '/users/reset-password',
      form
    );
  }

  async updateComment(id: string, form: { body: string }) {
    return await this.put<typeof form, {}>(`/comments/${id}`, form);
  }

  async getComments(postid: string, limit: number, offset: number) {
    return await this.get<
      { limit: number; offset: number; postid: string },
      {
        data: {
          result?: CommentsUser[];
          total: number;
          message?: string;
        };
      }
    >('/comments/', { limit, offset, postid });
  }

  async getComment(commentid: string) {
    return await this.get<
      {},
      {
        data: {
          result?: CommentsUser;
          message?: string;
        };
      }
    >(`/comments/${commentid}`, {});
  }

  async deleteComment(commentid: string) {
    return await this.delete<{
      data: {
        message?: string;
      };
    }>(`/comments/${commentid}`);
  }

  async createComment(postid: string, body: string) {
    return await this.post<
      { postid: string; body: string },
      {
        data: {
          result?: Comment;
          message?: string;
        };
      }
    >('/comments/', { postid, body });
  }
}
