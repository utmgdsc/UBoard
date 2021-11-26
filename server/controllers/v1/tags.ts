import { Tag } from '../../models/tags';
import db from '../../models';
import { Post } from '../../models/post';

export default class TagsController {
  protected tagsRepo: typeof Tag; // TODO

  constructor(tagsRepo: typeof Tag) {
    this.tagsRepo = tagsRepo;
  }

  async createTags(
    tags: string[]
  ): Promise<{ status: number; message?: string; data?: Tag[] }> {
    const promises = tags.map((text) => {
      return this.tagsRepo.create({
        text,
      });
    });
    const data = await Promise.all(promises);

    if (!data) {
      return { status: 400, message: 'Failed to create tags' };
    }

    return { status: 200, data };
  }

  async getPostsByTag(
    text: string
  ): Promise<{ status: number; data?: Post[]; message?: string }> {
    const tag = await this.tagsRepo.findByPk(text);

    if (!tag) {
      return { status: 400, message: 'Tag does not exist' };
    }

    const data = await tag.getPosts();

    return { status: 200, data };
  }
}
