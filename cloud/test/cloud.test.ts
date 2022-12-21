import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { StgStack as Cloud } from "../lib/stg-stack";

test("VPC created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Cloud(app, "MyTestStack");
  const template = Template.fromStack(stack);
  // THEN

  template.resourceCountIs("AWS::EC2::VPC", 1);
});
