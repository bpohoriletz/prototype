import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";

//import { createNonprodDatabase } from "./aws-cdk-kit/rds/postgres"
import { createVpc } from "./aws-cdk-kit/ec2/vpc";

export class NonProdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  public async synth(stackName: string) {
    const resourceNamePrefix = [stackName];
    // Step 1: Create VPC
    const nonProdVpc = createVpc(resourceNamePrefix, this);
    const _sharedVpcId = new ssm.StringParameter(this, `${stackName}VpcID`, {
      parameterName: `/${stackName}/VpcID`,
      stringValue: nonProdVpc.vpcId,
      description: "This parameter stores a configuration value for my application",
    });
    // Step H: Create RDS server
    // const [_preProductionDb, _rdsSg ] = createNonprodDatabase(resourceNamePrefix, this, preProductionVpc);
  }
}
