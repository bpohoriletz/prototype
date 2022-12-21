import { Stack } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import * as con from "../naming/resources";

export function createAppRole(resourceNamePrefix: string[], stack: Stack) : Role {
  const cloudAppRole = new Role(stack, con.ebApplicationRoleName(resourceNamePrefix), {
    assumedBy: new ServicePrincipal("cloudformation.amazonaws.com"),
  })

  return cloudAppRole;
}
