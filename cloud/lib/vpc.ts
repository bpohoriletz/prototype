import { Stack } from "aws-cdk-lib";
import { Vpc, IpAddresses, SubnetConfiguration, SubnetType } from "aws-cdk-lib/aws-ec2";
import * as con from "./naming/resources";

export function createMinimalVpc(resourceNamePrefix: string[], stack: Stack) : Vpc {
    // configure subnets
    const subnetConfigurations: SubnetConfiguration[] = [
      {
        subnetType: SubnetType.PUBLIC,
        name: con.ec2PublicSubnetName(resourceNamePrefix),
      },
      {
        subnetType: SubnetType.PRIVATE_ISOLATED,
        name: con.ec2IsolatedSubnetName(resourceNamePrefix),
      },
      {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        name: con.ec2PrivateSubnetName(resourceNamePrefix),
      }
    ];
    // create vpc
    const vpc = new Vpc(stack, con.ec2VpcName(resourceNamePrefix), {
      ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
      natGateways: 1,
      subnetConfiguration: subnetConfigurations,
      maxAzs: 2,
    });

    return vpc;
}
