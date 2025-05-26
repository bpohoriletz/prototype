import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { createCdApplication } from './aws-cdk-kit/codedeploy/app';
import { createCodedeployRole } from './aws-cdk-kit/codedeploy/role';
import { createPublicDeploymentGroup } from './aws-cdk-kit/codedeploy/deployment-group';
import { createEc2InstanceProfile } from './aws-cdk-kit/roles/ec2-profile';
// import { createGithubCliRole } from './aws-cdk-kit/iam/role';
import { createTempPrivateBucket } from './aws-cdk-kit/s3/bucket';
import PetVpcBuilder from './aws-cdk-kit/ec2/vpc-builders/pet';
import VpcDirector from './aws-cdk-kit/directors/vpc';

export class PrototypeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  public async synth(stackName: string, projectName: string) {
    const resourceNamePrefix = [stackName, projectName];
    // Step 1: Get VPC
    const parserVpc = new VpcDirector(PetVpcBuilder).constructVpc(this, 'Vpc');
    // Step 2: Create S3 bucket
    const cdBucket = createTempPrivateBucket([`codedeploy-${stackName}-${projectName}`, this.region, this.account], this);
    // Step 3: Create Roles
    // createGithubCliRole('bpohoriletz', this);
    const cdRole = createCodedeployRole(resourceNamePrefix, cdBucket.bucketArn, this);
    const instanceProfile = createEc2InstanceProfile(resourceNamePrefix, cdBucket.bucketArn, this);
    // Step 4: Create App
    const parserApp = createCdApplication(resourceNamePrefix, this);
    parserApp.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    // Step 5: Create Deployment Group
    const instanceTypes = [new ec2.InstanceType('t2.micro')];
    createPublicDeploymentGroup(resourceNamePrefix, instanceTypes, parserApp, instanceProfile, cdRole, parserVpc, this);
  }
}
