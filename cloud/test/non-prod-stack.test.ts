import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { NonProdStack } from "../lib/non-prod-stack";

describe("new NonProdStack()", () => {
  let stack: NonProdStack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new NonProdStack(app, "NonProdStackID", { env: { account: "00000000", region: "us-east-1"} })
  });

  test("matches snapshot", async () => {
    await stack.synth("stackName");

    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
