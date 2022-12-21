/* eslint-disable @typescript-eslint/no-unused-vars */

function partsToName(parts: string[]) : string {
  //return parts.join("-").toLowerCase();
  return parts.map(chunk => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join("");
}
// S3
export function s3BucketName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,3).concat("bct");

  return partsToName(name);
}
export function s3BucketDeploymentName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,3).concat("bct", "deployment");

  return partsToName(name);
}
// ElasticBeanstalk
export function ebApplicationName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,2).concat("app");

  return partsToName(name);
}

export function ebApplicationRoleName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,2).concat("app", "role");

  return partsToName(name);
}

export function ebEnvironmentName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,3).concat("env");

  return partsToName(name);
}
// EC2
export function ec2VpcName(resourceNamePrefix: string[]) : string {
  const name: string[] = ["vpc"];

  return partsToName(name);
}
export function ec2PublicSubnetName(resourceNamePrefix: string[]) : string {
  const name: string[] = ["public"];

  return partsToName(name);
}
export function ec2PrivateSubnetName(resourceNamePrefix: string[]) : string {
  const name: string[] = ["private"];

  return partsToName(name);
}
export function ec2IsolatedSubnetName(resourceNamePrefix: string[]) : string {
  const name: string[] = ["isolated"];

  return partsToName(name);
}
export function ec2SecurityGroupName(resourceNamePrefix: string[], kind: string) : string {
  const name: string[] = resourceNamePrefix.concat(kind, "sg");

  return partsToName(name);
}
// IAM
export function iamInstanceRoleName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,3).concat("ec2", "inst", "role");

  return partsToName(name);
}
export function iamInstanceProfileName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,3).concat("ec2", "inst", "prof");

  return partsToName(name);
}
// RDS
export function rdsEbEnvDatabaseName(resourceNamePrefix: string[]) : string {
  const name: string[] = resourceNamePrefix.slice(0,3).concat("db");

  return name.join("_").toLowerCase();
}
export function rdsStackName(resourceNamePrefix: string[]) : string {
  const name: string[] = ["rds"];

  return partsToName(name);
}
