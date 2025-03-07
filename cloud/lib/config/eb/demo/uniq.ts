import { aws_elasticbeanstalk as eb } from "aws-cdk-lib";
import * as names from "../../../aws-cdk-kit/naming/resources";

export function envConfig(resourceNamePrefix: string[], _scope: string): eb.CfnEnvironment.OptionSettingProperty[] {
  const name = names.shortEbEnvironmentName(resourceNamePrefix);
  const config = {
    "prototype-sandbox":
    [
      {
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleUp",
        "optionName": "MinSize",
        "value": "4"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleUp",
        "optionName": "MaxSize",
        "value": "4"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleUp",
        "optionName": "DesiredCapacity",
        "value": "4"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleUp",
        "optionName": "StartTime",
        "value": "2024-01-01T00:00:00Z"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleUp",
        "optionName": "EndTime",
        "value": "2034-01-01T00:00:00Z"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleUp",
        "optionName": "Recurrence",
        "value": "10 22 * * *"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleDownToOne",
        "optionName": "MinSize",
        "value": "1"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleDownToOne",
        "optionName": "MaxSize",
        "value": "1"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleDownToOne",
        "optionName": "DesiredCapacity",
        "value": "1"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleDownToOne",
        "optionName": "StartTime",
        "value": "2024-01-01T00:00:00Z"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleDownToOne",
        "optionName": "EndTime",
        "value": "2034-01-01T00:00:00Z"
      },{
        "namespace": "aws:autoscaling:scheduledaction",
        "resourceName": "ScaleDownToOne",
        "optionName": "Recurrence",
        "value": "00 23 * * *"
      }
    ],
  };

  if (config.hasOwnProperty(name)) {
    console.log(`[DEBUG] "${name}" - Loaded uniq options.`);
    return config[name as keyof typeof config];
  } else {
    console.log(`[DEBUG] "${name}" - Uniq options not found.`);
    return [];
  }
}
