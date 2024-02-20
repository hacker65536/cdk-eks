import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as aps from "aws-cdk-lib/aws-aps";
import * as logs from "aws-cdk-lib/aws-logs";
import * as grafana from "aws-cdk-lib/aws-grafana";

export class CdkEksStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const mastersRole = new iam.Role(this, "MastersRole", {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("eks.amazonaws.com"),
        new iam.AccountRootPrincipal()
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSClusterPolicy"),
      ],
      inlinePolicies: {
        "eksctl-iamidentitymapping": new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["eks:DescribeCluster"],
              resources: ["*"],
            }),
          ],
        }),
      },
    });

    const cluster = new eks.Cluster(this, "Cluster", {
      vpc,
      defaultCapacity: 2,
      mastersRole,
      version: eks.KubernetesVersion.V1_29,
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUDIT,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
        eks.ClusterLoggingTypes.SCHEDULER,
      ],
    });

    new cdk.CfnOutput(this, "ClusterArn", {
      value: cluster.clusterArn,
    });

    new cdk.CfnOutput(this, "PrivateSubnets", {
      value: vpc.privateSubnets.map((s) => s.subnetId).join(","),
    });

    new cdk.CfnOutput(this, "Sg", {
      value: cluster.clusterSecurityGroup.securityGroupId,
    });
  }
}
