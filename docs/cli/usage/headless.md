---
title: Headless mode for CI/CD
description: Several commands in the Amplify CLI support arguments which could potentially be used in your CI/CD flows.
---
Several commands in the Amplify CLI support arguments which could be used in a CI/CD workflow or other non-interactive shell. The CLI will work non-interactively if the required information is provided by an argument.

Arguments are used mostly for scripting so that the command execution flow is not interrupted by prompts. Examples for this can be found [here](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-cli/sample-headless-scripts)

**`--yes` flag**

The `--yes` flag, or its alias `-y`, suppresses command line prompts if defaults are available, and uses the defaults in command execution.
The following commands take the `--yes` flag:

- `amplify init`
- `amplify configure project`
- `amplify push`
- `amplify publish`
- `amplify pull`

## `amplify init` parameters

The `amplify init` command takes these parameters:

- `--amplify`
- `--frontend`
- `--providers`
- `--categories`
- `--yes`
- `--app`

### `--amplify`

Contains basic information of the project, it has these keys:

- `projectName`: the name of the project under development
- `appId`: the Amplify Service project Id (optional, see below)
- `envName`: the name of your first environment
- `defaultEditor`: your default code editor

The `appId` parameter is optional and it is used in two use cases.

- Amplify Service uses it internally when you initialize a project on Amplify web console.
- For project migrations. For projects initialized by Amplify CLI version prior to 4.0.0, no Amplify Service project is created online to track the backend environment's resources. The latest version of the Amplify CLI will create a new Amplify Service project for them in the post-push check. If you wanted to add the backend environment to an existing Amplify Service project instead of creating a new one, you can run `amplify init` again, and provide the `appId` inside the `--amplify` parameter, or explicitly as `amplify init --appId <Amplify-Service-Project-AppId>`.

### `--frontend`

Contains information for the CLI's frontend plugin, it has these keys:

- `frontend`: the name of the chosen frontend plugin (without the `amplify-frontend-` prefix).
- `framework`: the frontend framework used in the project, such as `react`. Only the `javascript` frontend handler takes it.
- `config`: the configuration settings for the frontend plugin.

There are currently three official frontend plugins, and the following are the specifications of their respective `config` object:
**`config` for `javascript`**

- `SourceDir`:
The project's source directory. The CLI will place and update the `aws-exports.js` file in it, the `aws-exports.js` file is used to configure the `Amplify JS` library.
- `DistributionDir`:
The project's distribution directory, where the build artifacts are stored. The CLI will upload the contents inside this directory to the S3 hosting buckets in the execution of the `amplify publish` command.
- `BuildCommand`:
The build command for the project. The CLI invokes the build command before uploading the contents in the distribution directory in the execution of the `amplify publish` command.
- `StartCommand`:
The start command for the project, used for local testing. The CLI invokes the start command after it has pushed the latest development of the backend to the cloud in the execution of the `amplify run` command.

**`config` for `android`**

- `ResDir`: The Android project's resource directory, such as `app/src/main/res`.

**`config` for `ios`**

The `ios` frontend handler does NOT take the `config` object.

### `--providers`

Contains configuration settings for provider plugins. The key is the name of the provider plugin (without the `amplify-provider-` prefix), and the value is its configuration. Provider plugins contained in this object will be initialized, and able to provide functionalities for creation and maintenance of the cloud resources.

Currently there is only one official provider plugin: `amplify-provider-awscloudformation`, its configuration is for the CLI to resolve aws credentials and region, the following are the specifications:

- `configLevel`:
The configuration level is either `project` or `general`. Unless explicitly set to `general`, the `project` level is chosen.
`general` level means the CLI will not manage configuration at the project level, it instead relies on the AWS SDK to resolve aws credentials and region. To learn how it works, check the AWS SDK's documents on [credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) and [region](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html).
`project` level means the configuration is managed at the project level by the CLI, each project gets its own independent configuration. The following attributes are used only when the configuration is at project level
- `useProfile`:
A boolean indicating whether to use a profile defined in the shared config file (`~/.aws/config`) and credentials file (`~/.aws/credentials`). <br/>
- `profileName`:
The name of the profile if `useProfile` is set to true.
- `accessKeyId`:
The aws access key id if `useProfile` is set to false.
- `secretAccessKey`:
The aws secret access key if `useProfile` is set to false.
- `region`:
The aws region if `useProfile` is set to false.

### `--categories`
Contains configuration settings for resources in the given categories. The key is the name of the category and the value is its configuration. There are resource parameters that are not persisted into configuration files and requires prompting for them during a headless CLI operation and to support headless workflows they are required to be passed in for each resource..

#### Imported resources

Currently `auth` and `storage` category resources can be imported to an Amplify CLI project.

#### `auth` category

- `userPoolId`: The Id of the Cognito User Pool that was imported into the project.
- `webClientId`: The Id of the app client configured for the given Cognito User Pool to be used by web applications.
- `nativeClientId`: The Id of the app client configured for the given Cognito User Pool to be used by Native applications.
- `identityPoolId`: In case if an Cognito Identity Pool was also configured for the `auth` resource this parameter is the Id of that resource. If there is no associated Cognito Identity Pool was configured, this parameter should not be passed in.

Sample `auth` category configuration:
```bash
AUTHCONFIG="{\
\"userPoolId\": \"myproject-userpool-id\",\
\"webClientId\": \"appid-web\",\
\"nativeClientId\": \"appid-native\",\
\"identityPoolId\": \"myproject-idp-poolid\"\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG\
}"
```

#### `storage` category

Storage category supports the importing of S3 Buckets and DynamoDB tables. They require different parameter sets within the storage category.

#### S3 Buckets

- `region`: The region of the S3 bucket resource. S3 Buckets are global, but the CLI requires to storage of the region as a parameter, so it needs to be passed in. Currently it must be the same region where the Amplify project was created.
- `bucketName`: The name of the imported S3 bucket.

```bash
STORAGECONFIG="{\
  \"region\": \"us-east-1\",\
  \"bucketName\": \"my-project-bucket\"\
}"

CATEGORIES="{\
  \"storage\":$STORAGECONFIG\
}"
```

#### DynamoDB Tables

An Amplify project can have multiple DynamoDB storage resources imported and the parameters must be supplied to each of them.
- `region`: The region of the DynamoDB table resources. Currently it must be the same region where the Amplify project was created.
- `tables`: An object where the key is the Amplify resource name and the value is the name of the DynamoDB table.

```bash
STORAGECONFIG="{\
  \"region\": \"us-east-1\",
  \"tables\": {\"
    \"posts\": \"myproject-posts-dev\",\
    \"comments\": \"myproject-comments-dev\",\
  }"\
}"

CATEGORIES="{\
  \"storage\":$STORAGECONFIG
}"
```

### `--app`

`amplify init --app git@github.com:<github-username>/<repository-name>.git`

Installs, initializes, and provisions resources for a sample amplify application from the provided GitHub repository URL. This option must be executed in an empty directory. The sample repository must have an amplify folder, including the following:

- `project-config.json` in .config folder
- `backend-config.json` in backend folder
- The necessary cloudformation files in the backend folder
  - e.g. stacks, `schema.graphql` for api
  - e.g. cloudformation template for auth

- local files local-env.json and local-aws-info.json are *NOT* required

If the repository contains a `yarn.lock` and/or `package.json` file, the sample will be installed with the corresponding package manager and started after resources have been provisioned.

### Sample script

```bash
#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"headlessaccesskeyid\",\
\"secretAccessKey\":\"headlesssecrectaccesskey\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"headlessProjectName\",\
\"envName\":\"myenvname\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify init \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
```

## `amplify configure project` parameters

The `amplify configure project` command allows the user to change the configuration settings that were first set by `amplify init`, and it takes the same parameters as the `amplify init` command:

- `--amplify`
- `--frontend`
- `--providers`
- `--yes`

### Sample script

```bash
#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"headlessaccesskeyid\",\
\"secretAccessKey\":\"headlesssecrectaccesskey\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"headlessProjectName\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify configure project \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
```

## `amplify push/publish` parameters

The `amplify publish` command internally executes `amplify push` so it takes the same parameters as push command. The `amplify push` command takes the following parameters

- `--codegen`
- `--yes`

### `--codegen`

Contains configuration for AppSync [codegen](~/cli/graphql-transformer/codegen.md), the following are the specifications:

- `generateCode`: <br/>
A boolean indicating if to generate code for your GraphQL API.<br/>
- `codeLanguage`: <br/>
The targeted language of the generated code, such as `javascript`.<br/>
- `fileNamePattern`:  <br/>
The file name pattern of GraphQL queries, mutations and subscriptions.<br/>
- `generatedFileName`:  <br/>
The file name for the generated code.<br/>
- `generateDocs`:  <br/>
A boolean indicating whether to generate GraphQL statements (queries, mutations and subscription) based on the GraphQL schema types. The generated version will overwrite the current GraphQL queries, mutations and subscriptions.<br/>

### Sample script

```bash
#!/bin/bash
set -e
IFS='|'

CODEGEN="{\
\"generateCode\":true,\
\"codeLanguage\":\"javascript\",\
\"fileNamePattern\":\"src/graphql/**/*.js\",\
\"generatedFileName\":\"API\",\
\"generateDocs\":true\
}"

amplify push \
--codegen $CODEGEN \
--yes
```

## `amplify pull` parameters

The `amplify pull` command pulls down the latest backend environment to your local development.
It is used in two scenarios:

1. On projects already initialized by the Amplify CLI, it pulls down the latest from the Cloud and updates the contents in the `amplify/#current-cloud-backend` directory. The command does not take any parameters when used in this scenario.
2. On projects NOT yet initialized by the Amplify CLI, it pulls down a particular backend environment, and "attaches" it to the project. It will fully set up the `amplify` directory for the project.  The backend environment being pulled is specified by `appId` and `envName` in the `amplify` parameter (see below). The command takes the following parameters when used in this scenario.
- `--amplify`
- `--frontend`
- `--providers`
- `--yes`

### `--amplify`

Contains basic information of the project, it has these keys:

- `projectName`: the name of the project under development
- `appId`: the Amplify Service project Id
- `envName`: the name of the backend environment in the above mention Amplify Service that you want to pull down
- `defaultEditor`: your default code editor

### `--frontend`

Contains information for the CLI's frontend plugin, it has these keys:

- `frontend`: the name of the chosen frontend plugin (without the `amplify-frontend-` prefix).
- `framework`: the frontend framework used in the project, such as `react`. Only the `javascript` frontend handler takes it.
- `config`: the configuration settings for the frontend plugin.

There are currently three official frontend plugins, and the following are the specifications of their respective `config` object:
**`config` for `javascript`**

- `SourceDir`:
The project's source directory. The CLI will place and update the `aws-exports.js` file in it, the `aws-exports.js` file is used to configure the `Amplify JS` library.
- `DistributionDir`:
The project's distribution directory, where the build artifacts are stored. The CLI will upload the contents inside this directory to the S3 hosting buckets in the execution of the `amplify publish` command.
- `BuildCommand`:
The build command for the project. The CLI invokes the build command before uploading the contents in the distribution directory in the execution of the `amplify publish` command.
- `StartCommand`:
The start command for the project, used for local testing. The CLI invokes the start command after it has pushed the latest development of the backend to the cloud in the execution of the `amplify run` command.

**`config` for `android`**

- `ResDir`: The Android project's resource directory, such as `app/src/main/res`.

**`config` for `ios`**

The `ios` frontend handler does NOT take the `config` object.

### `--providers`

The pull command is tied to the official provider plugin: `amplify-provider-awscloudformation` to pull down and attach a backend environment to your frontend project.

- `configLevel`:
The configuration level is either `project` or `general`. Unless explicitly set to `general`, the `project` level is chosen.
`general` level means the CLI will not manage configuration at the project level, it instead relies on the AWS SDK to resolve aws credentials and region. To learn how it works, check the AWS SDK's documents on [credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) and [region](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html).
`project` level means the configuration is managed at the project level by the CLI, each project gets its own independent configuration. The following attributes are used only when the configuration is at project level
- `useProfile`:
A boolean indicating whether to use a profile defined in the shared config file (`~/.aws/config`) and credentials file (`~/.aws/credentials`). <br/>
- `profileName`:
The name of the profile if `useProfile` is set to true.
- `accessKeyId`:
The aws access key id if `useProfile` is set to false.
- `secretAccessKey`:
The aws secret access key if `useProfile` is set to false.
- `region`:
The aws region if `useProfile` is set to false.

### Sample script

```bash
#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"headlessaccesskeyid\",\
\"secretAccessKey\":\"headlesssecrectaccesskey\",\
\"region\":\"us-east-1\"\
}"
AMPLIFY="{\
\"projectName\":\"headlessProjectName\",\
\"appId\":\"amplifyServiceProjectAppId\",\
\"envName\":\"myenvname\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
```

## `amplify delete` parameters

The `amplify delete` command deletes all of the resources tied to the current project in the cloud, and removes all of the local files created by the Amplify CLI from the filesystem. The `amplify delete` command takes these parameters:

- `--force`

### `--force`

Equivalent to the `--yes` parameter that other commands support for use in headless environments.

### Sample script

```bash
#!/bin/bash
set -e

amplify delete --force
```

## Headless category payloads

Some categories' headless mode work differently than above in that they expect a JSON payload on `stdin` rather than reading command parameters. The `--headless` flag is used to let Amplify CLI know that it should read the JSON payload in a single line from `stdin`. The input JSON is validated against the expected shape (described below). Once the validation passes, the operation is executed.

> Because the CLI reads a single line from `stdin`, it is necessary to make sure the JSON does not contain any newlines. [jq](https://stedolan.github.io/jq/) can be used to accomplish this:

```bash
cat myAddApiRequest.json | jq -c | amplify add api --headless
```

### Supported commands

The commands that currently support this method of supplying headless parameters are:

- `amplify add auth --headless`
- `amplify import auth --headless`
- `amplify update auth --headless`
- `amplify add api --headless`
- `amplify update api --headless`

### Payload structure

The structure of the JSON objects supplied on `stdin` are defined in [amplify-headless-interface](https://www.npmjs.com/package/amplify-headless-interface). This package contains both JSON Schema and TypeScript definitions for:

- [Add Auth Payload](https://github.com/aws-amplify/amplify-cli/blob/master/packages/amplify-headless-interface/src/interface/auth/add.ts)
- [Import Auth Payload](https://github.com/aws-amplify/amplify-cli/blob/master/packages/amplify-headless-interface/src/interface/auth/import.ts)
- [Update Auth Payload](https://github.com/aws-amplify/amplify-cli/blob/master/packages/amplify-headless-interface/src/interface/auth/update.ts)
- [Add API Payload](https://github.com/aws-amplify/amplify-cli/blob/master/packages/amplify-headless-interface/src/interface/api/add.ts)
- [Update API Payload](https://github.com/aws-amplify/amplify-cli/blob/master/packages/amplify-headless-interface/src/interface/api/update.ts)

### (Optional) IDE setup for headless development

To get started, install the interface package using `npm i amplify-headless-interface`. Then, if your editor supports it, configure your editor to know about the schemas in this package.

In Visual Studio Code add the following to `settings.json` under the `json.schemas` block to associate the specified file extensions with the corresponding schemas:

```json
"json.schemas": [
  {
    "fileMatch": [
      "*.addauth.json"
    ],
    "url": "./node_modules/amplify-headless-interface/schemas/auth/1/AddAuthRequest.schema.json"
  },
  {
    "fileMatch": [
      "*.updateauth.json"
    ],
    "url": "./node_modules/amplify-headless-interface/schemas/auth/1/UpdateAuthRequest.schema.json"
  },
  {
    "fileMatch": [
      "*.importauth.json"
    ],
    "url": "./node_modules/amplify-headless-interface/schemas/auth/1/ImportAuthRequest.schema.json"
  },
  {
    "fileMatch": [
      "*.addapi.json"
    ],
    "url": "./node_modules/amplify-headless-interface/schemas/api/1/AddApiRequest.schema.json"
  },
  {
    "fileMatch": [
      "*.updateapi.json"
    ],
    "url": "./node_modules/amplify-headless-interface/schemas/api/1/UpdateApiRequest.schema.json"
  }
]
```

Create a file such as `MyAuthTemplate.addauth.json`. Once you start editing, Visual Studio Code will provide auto-completion and suggestions based on the schema.

> If you prefer not to add this configuration, you can also specify a `$schema` block your JSON body to tell Visual Studio Code how to validate the JSON. See Visual Studio Code's [JSON schemas and settings](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings) for more details on this configuration.

### Example: "amplify add api" headless configuration

This example showcases how to use headless mode to configure `amplify add api`.

Create a file called `newHeadlessApi.addapi.json` and paste in the following contents:

```json
{
  "version": 1,
  "serviceConfiguration": {
    "serviceName": "AppSync",
    "apiName": "myNewHeadlessApi",
    "transformSchema": "type Todo @model {\r\n  id: ID!\r\n  name: String!\r\n  description: String\r\n}",
    "defaultAuthType": {
      "mode": "API_KEY"
    }
  }
}
```

Run `cat newHeadlessApi.addapi.json | jq -c | amplify add api --headless` to add the API resource.

> If you don't have `jq` installed, see <https://stedolan.github.io/jq/download/>.
