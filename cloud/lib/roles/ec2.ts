import { Role, RoleProps, ServicePrincipal, ManagedPolicy, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import * as con from "../naming/resources";

export function createEc2Role(resourceNamePrefix: string[], regionalEbBucketArn: string, stack: Stack) : Role {
  const roleProps: RoleProps = {
    assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
    managedPolicies: [
      ManagedPolicy.fromManagedPolicyArn(stack, stack.stackId, "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore")
    ]
  }
  const ec2Role = new Role(stack, con.iamInstanceRoleName(resourceNamePrefix), roleProps)
  const allowEc2UploadLogsToEbRegionalBucket: Policy = new Policy(stack, "allowEc2UploadLogsToEbRegionalBucket", {
    statements: [
      new PolicyStatement({
        actions: ["s3:PutObject", "s3:ListBucket", "s3:ListBucketVersions", "s3:GetObject", "s3:GetObjectVersion"],
        resources: [regionalEbBucketArn, `${regionalEbBucketArn}/resources/environments/*`],
      })
    ],
  })
  allowEc2UploadLogsToEbRegionalBucket.attachToRole(ec2Role);

  return ec2Role;
}
