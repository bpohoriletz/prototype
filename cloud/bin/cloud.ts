#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { PreProductionStack } from "../lib/pre-production-stack";

const app = new App();
new PreProductionStack(app, "PreProduction");
