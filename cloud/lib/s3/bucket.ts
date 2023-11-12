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

export function createRegionalEbBucket(stack: Stack) : CfnBucket {
  const resourceName = `elasticbeanstalk-${stack.region}-${stack.account}`;
  const bucket = new CfnBucket(stack, "ElasticBeanstalkRegionalBucket", {
    bucketName: resourceName,
    ownershipControls: {
      rules: [{
        objectOwnership: "BucketOwnerPreferred"
      }]
    }
  });
  bucket.applyRemovalPolicy(RemovalPolicy.RETAIN);

  const policyDocument = {
    "Version": "2008-10-17",
    "Statement": [
      {
        "Sid": "PlaceboStatementToTrackAndDestroyDefaultPolicy",
        "Effect": "Deny",
        "Principal": { "Federated": ["www.amazon.com"] },
        "Action": "s3:*",
        "Resource": bucket.attrArn
      }
    ]
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cfnBucketPolicy = new CfnBucketPolicy(stack, "RegionalElasticBenastalkCfnBucketPolicy", {
    bucket: resourceName,
    policyDocument: policyDocument,
  });

  return bucket;
}
