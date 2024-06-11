import { Stack } from "aws-cdk-lib";
import { Source, BucketDeployment } from "aws-cdk-lib/aws-s3-deployment";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { CfnApplication, CfnApplicationVersion } from "aws-cdk-lib/aws-elasticbeanstalk";
import * as con from "../naming/resources";

export function createInitAppVersions(resourceNamePrefix: string[],
                                      application: CfnApplication,
                                      bucketArn: string,
                                      stack: Stack) : CfnApplicationVersion {

    // store demo app in the bucket
    // https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/samples/ruby.zip
    const name: string = con.s3BucketDeploymentName(resourceNamePrefix);
    const bucket: IBucket = Bucket.fromBucketArn(stack, "RegionalEbBucket-local", bucketArn)
    const versionDeployment = new BucketDeployment(stack, name, {
      sources: [Source.asset("./app_versions")],
      destinationBucket: bucket,
      destinationKeyPrefix: `${application.applicationName!}/versions`,
      prune: false
    });

    // Create a new application version
    const initialVersion = new CfnApplicationVersion(stack, "InitialVersion", {
      applicationName: application.applicationName!,
      sourceBundle: {
        s3Bucket: bucket.bucketName!,
        s3Key: `${application.applicationName!}/versions/initial.zip`,
      },
      description: "Initial application from AWS"
    });
    initialVersion.node.addDependency(versionDeployment);

    // Create a new application version
    const openingVersion = new CfnApplicationVersion(stack, "OpeningVersion", {
      applicationName: application.applicationName!,
      sourceBundle: {
        s3Bucket: bucket.bucketName!,
        s3Key: `${application.applicationName!}/versions/opening.zip`,
      },
      description: "First version of the application"
    });
    openingVersion.node.addDependency(versionDeployment);

    return openingVersion;
}
