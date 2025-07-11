import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(
  fileBuffer: Buffer,
  originalName: string,
  folder = 'profile-pictures',
  mimetype?: string,
): Promise<string> {
  const fileExt = originalName.split('.').pop();
  const key = `${folder}/${uuidv4()}.${fileExt}`;

  const params = {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
}
