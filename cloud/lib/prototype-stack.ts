import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

import { createAppRole } from "./aws-cdk-kit/roles/app"
import { createApplication } from "./aws-cdk-kit/eb/app"
import { createNonprodDatabase } from "./aws-cdk-kit/rds/postgres"
import { createEc2InstanceProfile } from "./aws-cdk-kit/roles/ec2-profile"
import { createEnvironment } from "./aws-cdk-kit/eb/env"
import { createInitAppVersions } from "./aws-cdk-kit/eb/app-version"
import { createMinimalVpc } from "./aws-cdk-kit/ec2/vpc"
import { createPrivateBucket } from "./aws-cdk-kit/s3/bucket";

export class PrototypeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  public async synth(stackName: string, projectName: string) {
    const environmentName = "demo";
    const resourceNamePrefix = [projectName, stackName, environmentName];
    // const resourceTags: string[] = [this.stackId, this.region, this.account];
    // Step 0 (tricky): Create regional bucket for ElasticBeanstalk
    const regionalEbBucket = Bucket.fromBucketName(this, "RegionalEbBucket", `elasticbeanstalk-${this.region}-${this.account}`);
    // Step 1: Create VPC
    const preProductionVpc = createMinimalVpc(resourceNamePrefix, this);
    // Step 2: Create RDS server
    const [_preProductionDb, _rdsSg ] = createNonprodDatabase(resourceNamePrefix, this, preProductionVpc);
    // Step 3: Create ElasticBeanstalk application
    const appRole = createAppRole(resourceNamePrefix, this);
    const preProductionApp = createApplication(resourceNamePrefix, appRole, this);
    // Step 3: Create ElasticBeanstalk environment
    const instanceProfile = createEc2InstanceProfile(resourceNamePrefix, [regionalEbBucket.bucketArn], this);
    const [demoEnv, _demoSg] = await createEnvironment(preProductionApp, resourceNamePrefix, instanceProfile, preProductionVpc, this, "64bit Amazon Linux 2023 v4.4.0 running Ruby 3.4");
    // Step 4 (optional): Create S3 bucket for ElasticBeanstalk environment
    const _ebBucket = createPrivateBucket(resourceNamePrefix, this);
    // Step 5: Create application version
    const appVersion = createInitAppVersions(resourceNamePrefix, preProductionApp, regionalEbBucket.bucketArn, this)
    // Step 6(optional): Deploy application version to ElasticBeanstalk environment
    if (this.node.tryGetContext("deployInitialVersion") == "yes") {
      demoEnv.versionLabel = appVersion.ref
    }
  }
}
