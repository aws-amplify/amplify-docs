---
title: Files and Folders
description: Learn more about the files and folders Amplify uses to maintain project state.
---

## Folders

The CLI places the following folder structure in the root directory of the project during `amplify init`:

```text
amplify
  .config
  #current-cloud-backend
  backend
```

### amplify/.config

> Manual edits okay: NO

> Add to version control: YES

Contains files that store cloud configuration and `settings/preferences`. Run `amplify configure` to change the project configuration.

### amplify/#current-cloud-backend

> Manual edits okay: NO

> Add to version control: NO

Contains the current cloud state of the checked out environment's resources. The contents of this folder should never be manually updated. It will be overwritten on operations such as `amplify push`, `amplify pull` or `amplify env checkout`.

### amplify/backend

> Manual edits okay: YES

> Add to version control: YES

Contains the latest local development state of the checked out environment's resources. The contents of this folder can be modified and running `amplify push` will push changes in this directory to the cloud.
Each plugin stores contents in its own subfolder within this folder.

### amplify/mock-data

> Manual edits okay: NO

> Add to version control: NO

Only created after running `amplify mock api`. It contains the SQLite databases that are used to back the local API when mocking. The contents should not be modified but you can delete the folder if you want to wipe your local API state.

## Core Amplify Files

These files work together to maintain the overall state of the Amplify project such as what resources are configured in the project, dependencies between resources, and when the last push was.

### backend-config.json
> Manual edits okay: YES

> Add to version control: YES

The `backend-config.json` in the `backend` directory contains configuration about your project's backend, such as how connects to AWS resources (eg. Cognito for auth or AppSync for an API backend). Typically, this file is updated by the CLI commands like `amplify add auth` or `amplify add api`. It can also be [extended manually](~/cli/usage/customcf.md) to configure your backend beyond Amplify CLI's features. Both the `amplify/backend` and `amplify/#current-cloud-backend` directories contain an `backend-config.json` file.

### amplify-meta.json

> Manual edits okay: NO

> Add to version control: NO

Both the `amplify/backend` and `amplify/#current-cloud-backend` directories contain an `amplify-meta.json` file. The `amplify-meta.json` in the `backend` directory serves as the whiteboard for the CLI core and the plugins to log internal information and communicate with each other.

The CLI core provides read and write access to the file for the plugins. Core collects the selected providers' outputs after init and logs them under the "providers" object, e.g. the awscloudformation provider outputs the information of the root stack, the deployment S3 bucket, and the authorized/unauthorized IAM roles, and they are logged under the providers.awscloudformation object. Each category plugin logs information under its own name.

Because one category might create multiple services within one project (e.g. the interactions category can create multiple bots), the category metadata generally follows a two-level structure like the following:

```json
{
  "<category>": {
    "<service1>": {
      //service1 metadata
    },
    "<service2>": {
      //service2 metadata
    }
  }
}
```

The metadata for each service is first logged into the meta file after the `amplify <category> add` command is executed, containing some general information that indicates one service of the category has been added locally.
Then, on the successful execution of the `amplify push` command, the `output` object will be added/updated in the service's metadata with information that describes the actual cloud resources that have been created or updated.

### aws-exports.js

> Manual edits okay: NO

> Add to version control: NO

This file is generated only for JavaScript projects.
It contains the consolidated outputs from all the categories and is placed under the `src` directory specified during the `init` process. It is updated after `amplify push`.

This file is consumed by the [Amplify](https://github.com/aws-amplify/amplify-js) JavaScript library for configuration. It contains information which is non-sensitive and only required for external, unauthenticated actions from clients (such as user registration or sign-in flows in the case of Auth) or for constructing appropriate endpoint URLs after authorization has taken place. Please see the following more detailed explanations:

- [Cognito security best practices for web app](https://forums.aws.amazon.com/message.jspa?messageID=757990#757990)
- [Security / Best Practice for poolData (UserPoolId, ClientId) in a browser JS app](https://github.com/amazon-archives/amazon-cognito-identity-js/issues/312)
- [Are the Cognito User pool id and Client Id sensitive?](https://stackoverflow.com/a/47865747/194974)

### amplifyconfiguration.json

> Manual edits okay: NO

> Add to version control: NO

This file is the same as `aws-exports.js` but for Android and iOS projects.

It is consumed by the [iOS](https://github.com/aws/aws-sdk-ios/) and [Android](https://github.com/aws/aws-sdk-android) native SDKs for configuration.

### .gitignore

> Manual edits okay: YES

> Add to version control: YES

When a new project is initialized from the Amplify CLI, Amplify will append the following to the .gitignore file in the root directory. A .gitignore file will be created if one does not exist.

```text
#amplify-do-not-edit-begin
amplify/\#current-cloud-backend
amplify/.config/local-*
amplify/logs
amplify/mock-data
amplify/backend/amplify-meta.json
amplify/backend/awscloudformation
amplify/backend/.temp
build/
dist/
node_modules/
aws-exports.js
awsconfiguration.json
amplifyconfiguration.json
amplifyconfiguration.dart
amplify-build-config.json
amplify-gradle-config.json
amplifytools.xcconfig
.secret-*
#amplify-do-not-edit-end
```

### team-provider-info.json

> Manual edits okay: NO

> Add to version control: ONLY IF REPOSITORY IS PRIVATE

Used to share project info within your team. Learn more at [Share single environment](~/cli/teams/shared.md#sharing-projects-within-the-team).

### cli.json

> Manual edits okay: YES

> Add to version control: YES

Contains feature flag configuration for the project. If this file does not exist, it is created by Amplify CLI during `amplify init`. Environment specific feature flag overrides can also be defined in `cli.<environment name>.json`.  If an environment specific file exists for the currently checked out environment, during `amplify env add` command the same file will be copied for the newly created environment as well. Learn more at [Feature flags](~/cli/reference/feature-flags.md).

## General Category Files

While each category plugin has some unique files, there are also some common files stored across all categories.

### \<category>-parameters.json

> Manual edits okay: NO

> Add to version control: YES

Stores the parameters selected during `amplify add <category>` so they can be used to populate answers during `amplify update <category>`. This file does NOT change the underlying category configuration; it is only used to populate answers in the walkthrough.

### parameters.json

> Manual edits okay: YES

> Add to version control: YES

Contains a JSON object that maps CloudFormation parameter names to values that will be passed to the CloudFormation template for the category. For example, if the CloudFormation template has the parameter:

```json
{
  "Parameters": {
    "RoleArn": {
      "Type": "String",
      "Default": "<default role ARN>"
    }
  }
}
```

And `parameters.json` contains

```json
{
  "RoleArn": "<role ARN override>"
}
```

Then the value of "RoleArn" when the template is pushed will be "\<role ARN override\>".

## Function Category Files

### amplify.state

> Manual edits okay: NO

> Add to version control: YES

Contains internal metadata about how the CLI should build and invoke the function.

## AppSync API Category Files

### transform.conf.json

> Manual edits okay: NO

> Add to version control: YES

Contains configuration about how to interpret the GraphQL schema and transform it into AppSync resolvers. Run `amplify api update` to change API category configuration.
