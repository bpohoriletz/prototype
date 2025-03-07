import * as ec2 from "aws-cdk-lib/aws-ec2";

export function vpcCidrConfig(name: string): ec2.IIpAddresses {
  const config = {
    "PrototypeSandboxDemoVpc": ec2.IpAddresses.cidr("10.0.0.0/16"),
  };

  if (config.hasOwnProperty(name)) {
    console.log(`[DEBUG] Loading VPC CIDR config: ${name}`);
    return config[name as keyof typeof config];
  } else {
    console.log(`[DEBUG] Using default CIDR for: ${name}`);
    return ec2.IpAddresses.cidr("10.255.0.0/16");
  }
}

export function vpcSubnetConfig(name: string): ec2.SubnetConfiguration[] {
  const config = {
    "PrototypeSandboxDemoVpc": [
      {
        name: "Public",
        subnetType: ec2.SubnetType.PUBLIC,
        cidrMask: 19,
      },
      {
        name: "Isolated",
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        cidrMask: 19,
      },
      {
        name: "Private",
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 19,
      },
    ],
  };

  if (config.hasOwnProperty(name)) {
    console.log(`[DEBUG] Loading VPC subnet config: ${name}`);
    return config[name as keyof typeof config];
  } else {
    console.log(`[DEBUG] Using default subnets for: ${name}`);
    return [
      {
        cidrMask: 18,
        name: "Public",
        subnetType: ec2.SubnetType.PUBLIC,
      }
    ];
  }
}
