import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as aps from "aws-cdk-lib/aws-aps";
import * as logs from "aws-cdk-lib/aws-logs";
import * as grafana from "aws-cdk-lib/aws-grafana";

export class CdkEksCollect extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const myapslog = new logs.LogGroup(this, "myapslog", {
      logGroupName: "/aws/aps/prometheus/apslog",
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const myaps = new aps.CfnWorkspace(this, "myaps", {
      alias: "prometheus_ws",
      loggingConfiguration: {
        logGroupArn: myapslog.logGroupArn,
      },
    });

    const wsRole = new iam.Role(this, "wsRole", {
      assumedBy: new iam.ServicePrincipal("grafana.amazonaws.com"),
    });

    wsRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["aps:*"],
        resources: ["*"],
      })
    );

    const mygrafana = new grafana.CfnWorkspace(this, "mygrafana", {
      accountAccessType: "CURRENT_ACCOUNT",
      authenticationProviders: ["AWS_SSO"],
      permissionType: "SERVICE_MANAGED",

      // the properties below are optional
      //clientToken: 'clientToken',
      dataSources: ["PROMETHEUS"],
      description: "description",
      grafanaVersion: "9.4",
      name: "mygrafana",
      /*
      networkAccessControl: {
        prefixListIds: ['prefixListIds'],
        vpceIds: ['vpceIds'],
      },
      notificationDestinations: ["notificationDestinations"],
      organizationalUnits: ["organizationalUnits"],
      organizationRoleName: "AdministratorAccess",
      pluginAdminEnabled: false,
      */
      roleArn: wsRole.roleArn,
      /*
      samlConfiguration: {
        idpMetadata: {
          url: "url",
          xml: "xml",
        },

        // the properties below are optional
        allowedOrganizations: ["allowedOrganizations"],
        assertionAttributes: {
          email: "email",
          groups: "groups",
          login: "login",
          name: "name",
          org: "org",
          role: "role",
        },
        loginValidityDuration: 123,
        roleValues: {
          admin: ["admin"],
          editor: ["editor"],
        },
      },
      */
      /*
      stackSetName: "stackSetName",
      vpcConfiguration: {
        securityGroupIds: ["securityGroupIds"],
        subnetIds: ["subnetIds"],
      },
      */
    });

    new cdk.CfnOutput(this, "WorkspaceArn", {
      value: myaps.attrArn,
    });
  }
}
