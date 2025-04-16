import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { RailsStack } from "../lib/rails-stack";

describe("new RailsStack()", () => {
  let stack: RailsStack;

  beforeEach(() => {
    const app = new cdk.App();
    const parentStack = new cdk.Stack(app, "StackID");
    stack = new RailsStack(parentStack, "RailsStackID", { env: { account: "00000000", region: "us-east-1"} })
  });

  test("matches snapshot", async () => {
    await stack.synth("stackName", "projectName");

    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
