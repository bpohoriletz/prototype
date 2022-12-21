import { Stack } from "aws-cdk-lib";
import { CfnInstanceProfile } from "aws-cdk-lib/aws-iam";
import { createEc2Role } from "./ec2";
import * as con from "../naming/resources";

export function createEc2InstanceProfile(resourceNamePrefix: string[], regionalEbBucketArn: string, stack: Stack) : CfnInstanceProfile {
  // create role for EC2
  const ec2Role = createEc2Role(resourceNamePrefix, regionalEbBucketArn, stack);
  const resourceName = con.iamInstanceProfileName(resourceNamePrefix)
  // embed role into instance profile
  const instanceProfile = new CfnInstanceProfile(stack, resourceName, {
    roles: [ec2Role.roleName],
    instanceProfileName: resourceName
  });

  return instanceProfile;
}
