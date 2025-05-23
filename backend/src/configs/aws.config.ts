import { S3Client } from "@aws-sdk/client-s3";
import configs from "./index";

const s3 = new S3Client({
  region: configs.general.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: configs.general.AWS_S3_ACCESS_KEY,
    secretAccessKey: configs.general.AWS_S3_SECRET_KEY,
  },
});

export { s3 };
