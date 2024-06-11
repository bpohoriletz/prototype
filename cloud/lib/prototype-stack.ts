import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import {
  CfnApplication,
  CfnApplicationVersion,
  CfnEnvironment,
} from "aws-cdk-lib/aws-elasticbeanstalk";
import { CfnInstanceProfile, Role } from "aws-cdk-lib/aws-iam";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";

import { createMinimalVpc } from "./vpc"
import { createAppRole } from "./roles/app"
import { createApplication } from "./eb/app"
import { createInitAppVersions } from "./eb/app-version"
import { createEc2InstanceProfile } from "./roles/ec2-profile"
import { createEnvironment } from "./eb/env"
import { createDatabase } from "./rds/postgres"

export class PrototypeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const projectName = "prototype";
    const stackName: string = id.replace("Stack", "");
    const environmentName = "demo";
    // dirrerent environments can't be specified with parameters
    // const environmentName: string = new CfnParameter(this, "environmentName", { type: "String", default: "demo" }).valueAsString.toLowerCase();
    const resourceNamePrefix: string[] = [projectName, stackName, environmentName];
    // const resourceTags: string[] = [this.stackId, this.region, this.account];
    // Step 0 (tricky): Create regional bucket for ElasticBeanstalk
    const regionalEbBucket: IBucket = Bucket.fromBucketName(this, "RegionalEbBucket", `elasticbeanstalk-${this.region}-${this.account}`);
    // Step 1: Create VPC
    const preProductionVpc: Vpc = createMinimalVpc(resourceNamePrefix, this);
    // Step 2: Create RDS server
    const preProductionDb: DatabaseInstance = createDatabase(resourceNamePrefix, this, preProductionVpc);
    // Step 3: Create ElasticBeanstalk application
    const appRole: Role = createAppRole(resourceNamePrefix, this);
    const preProductionApp: CfnApplication = createApplication(resourceNamePrefix, appRole, this);
    // Step 3: Create ElasticBeanstalk environment
    const instanceProfile: CfnInstanceProfile = createEc2InstanceProfile(resourceNamePrefix, regionalEbBucket.bucketArn, this);
    // const demoEnv: CfnEnvironment = createEnvironment(preProductionApp, resourceNamePrefix, preProductionVpc, instanceProfile, preProductionDb, this, "64bit Amazon Linux 2 v3.6.17 running Ruby 3.0");
    const demoEnvRails3: CfnEnvironment = createEnvironment(preProductionApp, resourceNamePrefix, preProductionVpc, instanceProfile, preProductionDb, this);
    // Step 4 (optional): Create S3 bucket for ElasticBeanstalk environment
    // const demoAppBucket = createPrivateBucket(resourceNamePrefix, this);
    // Step 5: Create application version
    const appVersion: CfnApplicationVersion = createInitAppVersions(resourceNamePrefix, preProductionApp, regionalEbBucket.bucketArn, this)
    // Step 6(optional): Deploy application version to ElasticBeanstalk environment
    if (this.node.tryGetContext("deployInitialVersion") == "yes") {
      demoEnvRails3.versionLabel = appVersion.ref
    }
  }
}
