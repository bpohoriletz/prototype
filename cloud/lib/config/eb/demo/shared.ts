import { aws_elasticbeanstalk as eb } from "aws-cdk-lib";

export function envConfig(_resourceNamePrefix: string[], scope: string): eb.CfnEnvironment.OptionSettingProperty[] {
  const config = {
    "demo": [
      {
        "namespace": "aws:elasticbeanstalk:application:environment",
        "optionName": "BUNDLE_PATH",
        "value": "/var/app/gems"
      },{
        "namespace": "aws:elasticbeanstalk:command",
        "optionName": "Timeout",
        "value": "3600"
      },{
        "namespace": "aws:elasticbeanstalk:environment",
        "optionName": "LoadBalancerType",
        "value": "application"
      },{
        "namespace": "aws:elasticbeanstalk:healthreporting:system",
        "optionName": "SystemType",
        "value": "basic"
      },{
        "namespace": "aws:ec2:instances",
        "optionName": "InstanceTypes",
        "value": "t2.micro,t2.small"
      },{
        "namespace": "aws:autoscaling:asg",
        "optionName": "MaxSize",
        "value": "4"
      },{
        "namespace": "aws:autoscaling:trigger",
        "optionName": "BreachDuration",
        "value": "1"
      },{
        "namespace": "aws:autoscaling:trigger",
        "optionName": "MeasureName",
        "value": "TargetResponseTime"
      },{
        "namespace": "aws:autoscaling:trigger",
        "optionName": "Unit",
        "value": "Seconds"
      },{
        "namespace": "aws:autoscaling:trigger",
        "optionName": "UpperThreshold",
        "value": "9"
      },{
        "namespace": "aws:autoscaling:trigger",
        "optionName": "LowerThreshold",
        "value": "0.9"
      },{
        "namespace": "aws:ec2:instances",
        "optionName": "EnableSpot",
        "value": "true"
      },{
        "namespace": "aws:ec2:instances",
        "optionName": "SpotFleetOnDemandBase",
        "value": "1"
      },{
        "namespace": "aws:ec2:instances",
        "optionName": "SpotFleetOnDemandAboveBasePercentage",
        "value": "0"
      },{
        "namespace": "aws:elasticbeanstalk:environment:process:default",
        "optionName": "HealthCheckPath",
        "value": "/accounts/sign_in"
      },{
        "namespace": "aws:elasticbeanstalk:environment:process:default",
        "optionName": "MatcherHTTPCode",
        "value": "200"
      }
    ]
  };

  if (config.hasOwnProperty(scope)) {
    console.log(`[DEBUG] "${scope}" - Loaded default shared options.`);
    return config[scope as keyof typeof config];
  } else {
    console.log(`[DEBUG] "${scope}" - Shared onfiguration not found.`);
    return [];
  }
}
