#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { NonProdStack } from "../lib/non-prod-stack";
import { RailsStack } from "../lib/rails-stack";

async function Main() {
  const app = new App();
  const cdkEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  };

  const sandboxStack = new NonProdStack(app, "Sandbox", {env: cdkEnv});
  sandboxStack.synth("sandbox");

  const railsStack = new RailsStack(app, "Rails", {env: cdkEnv});
  railsStack.synth("sandbox", "prototype");
}

Main();
