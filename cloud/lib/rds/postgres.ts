import { Duration } from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as con from "../naming/resources";

export function createDatabase(resourceNamePrefix: string[], stack: Stack, vpc: ec2.Vpc) : rds.DatabaseInstance {

  const mysqlInstance: rds.DatabaseInstance = new rds.DatabaseInstance(stack, con.rdsStackName(resourceNamePrefix), {
    databaseName: con.rdsEbEnvDatabaseName(resourceNamePrefix),
    vpc: vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
    engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_9 }),
    multiAz: false,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
    storageType: rds.StorageType.STANDARD,
    backupRetention: Duration.days(0)
  });

  return mysqlInstance
}
