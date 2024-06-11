import { Stack, RemovalPolicy } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess, CfnBucket, CfnBucketPolicy } from "aws-cdk-lib/aws-s3";
import * as con from "../naming/resources"

export function createPrivateBucket(resourceNamePrefix: string[], stack: Stack) : Bucket {
  const resourceName: string = con.s3BucketName(resourceNamePrefix);
  const bucket: Bucket = new Bucket(stack, resourceName, {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    versioned: false,
    removalPolicy: RemovalPolicy.DESTROY
  });

  return bucket;
}
