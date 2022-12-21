import { readFileSync } from "fs";
import { Stack, CfnOutput } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { CfnApplication, CfnEnvironment, CfnEnvironmentProps } from "aws-cdk-lib/aws-elasticbeanstalk";
import { CfnInstanceProfile } from "aws-cdk-lib/aws-iam";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import * as con from "../naming/resources"

export function createEnvironment(application: CfnApplication,
  resourceNamePrefix: string[],
  vpc: ec2.Vpc,
  instanceProfile: CfnInstanceProfile,
  rdsDatabase: DatabaseInstance,
  stack: Stack) : CfnEnvironment {
    const environmentName: string = con.ebEnvironmentName(resourceNamePrefix);
    const solutionStackName = "64bit Amazon Linux 2 v3.6.9 running Ruby 3.0";
    const securityGroups: ec2.SecurityGroup[] = createSecurityGroups(resourceNamePrefix, vpc, stack);

    const envOptions: CfnEnvironmentProps = {
      applicationName: application.applicationName!,
      environmentName: environmentName,
      solutionStackName: solutionStackName,
      optionSettings: [
        // Documentation - https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
        // Load in EC2   - export $(/opt/elasticbeanstalk/bin/get-config --output YAML environment | sed -r 's/: /=/' | xargs)
        {
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: "RAILS_MASTER_KEY",
          value: readFileSync("../config/master.key").toString()
        },{
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: "RDS_CREDENTIALS",
          value: rdsDatabase.secret!.secretValue.unsafeUnwrap()
        },{
          namespace: "aws:elasticbeanstalk:healthreporting:system",
          optionName: "SystemType",
          value: "basic"
        },{
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "SecurityGroups",
          value: securityGroups[1].securityGroupId
        },{
          namespace: "aws:elbv2:loadbalancer",
          optionName: "SecurityGroups",
          value: securityGroups[0].securityGroupId
        },{
          namespace: "aws:ec2:instances",
          optionName: "InstanceTypes",
          value: "t2.micro"
        },{
          namespace: "aws:ec2:vpc",
          optionName: "ELBSubnets",
          value: vpc.publicSubnets.map(subnet => subnet.subnetId).join(",")
        },{
          namespace: "aws:ec2:vpc",
          optionName: "Subnets",
          value: vpc.privateSubnets.map(subnet => subnet.subnetId).join(",")
        },{
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: instanceProfile.instanceProfileName!
        }
      ]
    };
    const env: CfnEnvironment = new CfnEnvironment(stack, environmentName, envOptions);
    env.addDependency(instanceProfile);
    env.addDependency(application);

    // Allow inbound traffic on port 5432 from the web instances
    rdsDatabase.connections.allowDefaultPortFrom(securityGroups[1])

    new CfnOutput(stack, "ApplicationUrl", {
      exportName: `${environmentName.toLowerCase()}-application-url`,
      value: env.attrEndpointUrl
    });

    return env;
  }

function createSecurityGroups(resourceNamePrefix: string[], vpc: ec2.Vpc, stack: Stack): ec2.SecurityGroup[] {
  let resourceName: string;
  // Create Security Group for load balancer
  resourceName = con.ec2SecurityGroupName(resourceNamePrefix.slice(0,3), "lb")
  const lbSecurityGroup = new ec2.SecurityGroup(stack, resourceName , {
    vpc: vpc,
    description: "Security Group for the Load Balancer",
    securityGroupName: resourceName,
    allowAllOutbound: true
  })

  // Allow Security Group inbound traffic for load balancer
  lbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "Allow incoming traffic over port 80");

  // Create Security Group for web instances
  resourceName = con.ec2SecurityGroupName(resourceNamePrefix.slice(0,3), "web")
  const webSecurityGroup = new ec2.SecurityGroup(stack, resourceName, {
    vpc: vpc,
    description: "Security Group for the Web instances",
    securityGroupName: resourceName,
    allowAllOutbound: true
  })

  // Allow Security Group inbound traffic over port 80 from the Load Balancer security group
  webSecurityGroup.connections.allowFrom(
    new ec2.Connections({
      securityGroups: [lbSecurityGroup]
    }),
    ec2.Port.tcp(80)
  )

  return [lbSecurityGroup, webSecurityGroup]
}

