import { Tag } from '../../models/tags';
import db from '../../models';
import { Post } from '../../models/post';

export default class TagsController {
  protected tagsRepo: typeof Tag & any; // TODO

  constructor(tagsRepo: typeof Tag) {
    this.tagsRepo = tagsRepo;
  }

  async createTags(
    tags: string[],
    postid: string
  ): Promise<{ status: number; message?: string; data?: Tag[] }> {
    const promises = tags.map((text) => {
      return this.tagsRepo.create(
        {
          text,
          Post: {
            postId: postid,
          },
        },
        {
          include: [
            {
              association: this.tagsRepo.associations.Posts, // tags belongstoMany call
              include: [db.Post.associations.Tags], // post belongstomany call
            },
          ],
        }
      );
    });

    const data = await Promise.all(promises);

    if (!data) {
      return { status: 400, message: 'failed to load tags' };
    }

    console.log(data);

    return { status: 200, data };
  }

  async getPost(
    text: string
  ): Promise<{ status: number; data?: Post; message?: string }> {}
}
