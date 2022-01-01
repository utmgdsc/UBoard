import b2 from 'backblaze-b2';
import fs from 'fs';

export default class FileManager {
  protected b2?: b2;

  constructor() {
    try {
      this.b2 = new b2({
        applicationKeyId: process.env.BACKBLAZE_APP_KEY_ID as string,
        applicationKey: process.env.BACKBLAZE_APP_KEY as string,
      });
      this.b2.authorize();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Check the status of the file manager.
   *
   * @returns Whether setting up backblaze was succesful or not
   */
  status() {
    return !this.b2;
  }

  /**
   * Upload the file.
   *
   * @param localFilePath - Path to the file on the temporary directory.
   * @param fileName	- The name of the file.
   * @return The location of the file on the file storage service or an empty string on failure
   */
  async upload(localFilePath: string, fileName: string) {
    if (!this.b2) {
      return '';
    }

    const uploadUrl = await this.b2.getUploadUrl({
      bucketId: process.env.BACKBLAZE_BUCKET_ID as string,
    });
    await this.b2.uploadFile({
      fileName: fileName,
      data: fs.readFileSync(localFilePath),
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
    });

    return `${process.env.PAGE_URL}file/${process.env.BACKBLAZE_BUCKET_NAME}/${fileName}`;
  }
}
