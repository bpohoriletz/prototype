import { readFileSync } from "fs";
import { Stack, CfnOutput } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { CfnApplication, CfnEnvironment, CfnEnvironmentProps } from "aws-cdk-lib/aws-elasticbeanstalk";
import { CfnInstanceProfile } from "aws-cdk-lib/aws-iam";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { CfnScheduledAction } from 'aws-cdk-lib/aws-autoscaling';
import * as con from "../naming/resources"

export function createEnvironment(application: CfnApplication,
  resourceNamePrefix: string[],
  vpc: ec2.Vpc,
  instanceProfile: CfnInstanceProfile,
  rdsDatabase: DatabaseInstance,
  stack: Stack,
  solutionStackName = "64bit Amazon Linux 2023 v4.0.4 running Ruby 3.2") : CfnEnvironment {
    const environmentName: string = con.ebEnvironmentName(resourceNamePrefix);
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
          optionName: "BUNDLE_PATH",
          value: "/var/app/gems"
        },{
          namespace: "aws:elasticbeanstalk:application:environment",
          optionName: "RDS_CREDENTIALS",
          value: rdsDatabase.secret!.secretValue.unsafeUnwrap()
        },{
          namespace: "aws:elasticbeanstalk:environment",
          optionName: "LoadBalancerType",
          value: "application"
        },{
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "MatcherHTTPCode",
          value: "302"
        },{
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "HealthCheckPath",
          value: "/"
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
          value: "t2.micro,t2.nano"
        },{
          namespace: "aws:ec2:vpc",
          optionName: "ELBSubnets",
          value: vpc.publicSubnets.map(subnet => subnet.subnetId).join(",")
        },{
          namespace: "aws:ec2:vpc",
          optionName: "Subnets",
          value: vpc.publicSubnets.map(subnet => subnet.subnetId).join(",")
          //value: vpc.privateSubnets.map(subnet => subnet.subnetId).join(",")
        },{
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: instanceProfile.instanceProfileName!
        },{
          namespace: "aws:autoscaling:asg",
          optionName: "MaxSize",
          value: "1"
        },{
          namespace: "aws:autoscaling:trigger",
          optionName: "BreachDuration",
          value: "1"
        },{
          namespace: "aws:autoscaling:trigger",
          optionName: "MeasureName",
          value: "TargetResponseTime"
        },{
          namespace: "aws:autoscaling:trigger",
          optionName: "Unit",
          value: "Seconds"
        },{
          namespace: "aws:autoscaling:trigger",
          optionName: "UpperThreshold",
          value: "9"
        },{
          namespace: "aws:autoscaling:trigger",
          optionName: "LowerThreshold",
          value: "0.9"
        },{
          namespace: "aws:ec2:instances",
          optionName: "EnableSpot",
          value: "true"
        },{
          namespace: "aws:ec2:instances",
          optionName: "SpotFleetOnDemandBase",
          value: "0"
        },{
          namespace: "aws:ec2:instances",
          optionName: "SpotFleetOnDemandAboveBasePercentage",
          value: "0"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleUp",
          optionName: "MinSize",
          value: "1"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleUp",
          optionName: "MaxSize",
          value: "1"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleUp",
          optionName: "DesiredCapacity",
          value: "1"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleUp",
          optionName: "StartTime",
          value: "2024-01-01T00:00:00Z"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleUp",
          optionName: "EndTime",
          value: "2034-01-01T00:00:00Z"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleUp",
          optionName: "Recurrence",
          value: "10 14 * * *"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleDownToOne",
          optionName: "MinSize",
          value: "1"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleDownToOne",
          optionName: "MaxSize",
          value: "1"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleDownToOne",
          optionName: "DesiredCapacity",
          value: "1"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleDownToOne",
          optionName: "StartTime",
          value: "2024-01-01T00:00:00Z"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleDownToOne",
          optionName: "EndTime",
          value: "2034-01-01T00:00:00Z"
        },{
          namespace: "aws:autoscaling:scheduledaction",
          resourceName: "ScaleDownToOne",
          optionName: "Recurrence",
          // make sure it's before any action in cron
          value: "00 09 * * *"
        },{
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "HealthCheckPath",
          value: "/accounts/sign_in"
        },{
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "MatcherHTTPCode",
          value: "200"
        }
      ]
    };
    const env: CfnEnvironment = new CfnEnvironment(stack, environmentName, envOptions);
    env.addDependency(instanceProfile);
    env.addDependency(application);

    // Allow inbound traffic on port 5432 from the web instances
    rdsDatabase.connections.allowDefaultPortFrom(securityGroups[1])

    new CfnOutput(stack, `${resourceNamePrefix.at(-1)}ApplicationUrl`, {
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
  lbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), "Allow incoming traffic over port 443");

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

