#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { PrototypeStack } from "../lib/prototype-stack";

const app = new App();
new PrototypeStack(app, "PreProd");
