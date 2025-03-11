import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ssm from "aws-cdk-lib/aws-ssm";

import { createAppRole } from "./aws-cdk-kit/roles/app";
import { createApplication } from "./aws-cdk-kit/eb/app";
import { createEc2InstanceProfile } from "./aws-cdk-kit/roles/ec2-profile";
import { createEnvironment } from "./aws-cdk-kit/eb/env";
import { createInitAppVersions } from "./aws-cdk-kit/eb/app-version";
import { createPrivateBucket } from "./aws-cdk-kit/s3/bucket";
import * as con from "./aws-cdk-kit/naming/resources";

export class RailsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  public async synth(stackName: string, projectName: string) {
    const environmentName = "demo";
    const resourceNamePrefix = [stackName, projectName, environmentName];
    // const resourceTags: string[] = [this.stackId, this.region, this.account];
    // Step 0 (tricky): Create regional bucket for ElasticBeanstalk
    const regionalEbBucket = Bucket.fromBucketName(this, "RegionalEbBucket", `elasticbeanstalk-${this.region}-${this.account}`);
    // Step 1: Fetch VPC
    const vpcID = ssm.StringParameter.fromStringParameterName(this, "vpcID", `/${stackName}/VpcID`).stringValue;
    const preProductionVpc = ec2.Vpc.fromLookup(this, "RailsVpc", {vpcName: con.ec2VpcName([stackName])})
    // Step H: Fetch RDS data
    // Step 2: Create ElasticBeanstalk application
    const appRole = createAppRole(resourceNamePrefix, this);
    const preProductionApp = createApplication(resourceNamePrefix, appRole, this);
    // Step 3: Create ElasticBeanstalk environment
    const instanceProfile = createEc2InstanceProfile(resourceNamePrefix, [regionalEbBucket.bucketArn], this);
    const [demoEnv, _demoSg] = await createEnvironment(preProductionApp, resourceNamePrefix, instanceProfile, preProductionVpc, this, "64bit Amazon Linux 2023 v4.4.0 running Ruby 3.4");
    // Step 4 (optional): Create S3 bucket for ElasticBeanstalk environment
    const _ebBucket = createPrivateBucket(resourceNamePrefix, this);
    // Step 5: Create application version
    const appVersion = createInitAppVersions(resourceNamePrefix, preProductionApp, regionalEbBucket.bucketArn, this);
    // Step 6(optional): Deploy application version to ElasticBeanstalk environment
    if (this.node.tryGetContext("deployInitialVersion") == "yes") {
      demoEnv.versionLabel = appVersion.ref;
    }
  }
}
