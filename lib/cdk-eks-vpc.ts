import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as aps from "aws-cdk-lib/aws-aps";
import * as logs from "aws-cdk-lib/aws-logs";
import * as grafana from "aws-cdk-lib/aws-grafana";

export class CdkEksVpc extends cdk.Stack {
  public vpc: ec2.Vpc;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 3,
    });

    this.vpc = vpc;
  }
}
