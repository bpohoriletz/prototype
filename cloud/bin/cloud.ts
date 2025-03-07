#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { PrototypeStack } from "../lib/prototype-stack";

async function Main() {
  const app = new App();
  const stack = new PrototypeStack(app, "Prototype");
  stack.synth("sandbox", "prototype")
}

Main()
