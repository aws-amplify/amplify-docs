---
title: Typical workflows
description: How to initialize a new Amplify project and other typical Amplify CLI workflows & commands.
---

## Initialize new project

To initialize a new Amplify project, run the following command from the root directory of your frontend app.

```bash
amplify init
```

The `init` command goes through the following steps:

- Analyzes the project and confirms the frontend settings
- Carries out the initialization logic of the selected frontend
- If there are multiple provider plugins, prompts to select the plugins that will provide accesses to cloud resources
- Carries out, in sequence, the initialization logic of the selected plugin(s)
- Insert amplify folder structure into the project's root directory, with the initial project configuration
- Generate the project metadata files, with the outputs of the above-selected plugin(s)
- Creates a cloud project in the [AWS Amplify Console](https://console.aws.amazon.com/amplify) to view and manage resources for all backend environments.

## Clone sample Amplify project

To clone a sample amplify fullstack project, execute the following command inside an empty directory:

`amplify init --app <github-url>`

where `<github-url>` is a valid sample Amplify project repository. Click [here](~/cli/usage/headless.md#--app) for more details.

## Common CLI commands

### amplify init

The `init` command can determine defaults for the project based on the contents of the directory. To accept the defaults offered, answer yes to:

`Initialize the project with the above configuration?`

During the init process, the root stack is created with three resources:

- IAM role for unauthenticated users
- IAM role for authenticated users
- S3 bucket, the deployment bucket, to support this provider's workflow

The provider logs the information of the root stack and the resources into the project metadata file (amplify/backend/amplify-meta.json).

### amplify \<category\> add

Once init is complete, run the command `amplify <category> add` to add resources of a category to the cloud. This will place a CloudFormation template for the resources of this category in the category's subdirectory `amplify/backend/<category>` and insert its reference into the above-mentioned root stack as the nested child stack. When working in teams, it is good practice to run an `amplify pull` before modifying the backend categories.

### amplify push

Once you have made your category updates, run the command `amplify push` to update the cloud resources. The CLI will first upload the latest versions of the category nested stack templates to the S3 deployment bucket, and then call the AWS CloudFormation API to create / update resources in the cloud. Based upon the resources added/updated, the `aws-exports.js` file (for JS projects) and the `awsconfiguration.json` file (for native projects) gets created/updated. The root stack's template can be found in `amplify/backend/awscloudformation`.

### amplify pull

The `amplify pull` command operates similar to a *git pull*, fetching upstream backend environment definition changes from the cloud and updating the local environment to match that definition. The command is particularly helpful in team scenarios when multiple team members are editing the same backend, pulling a backend into a new project, or when connecting to [multiple frontend projects](~/cli/teams/multi-frontend.md) that share the same Amplify backend environment.

This command can accept two parameters `appId` and `envName`.
`amplify pull --appId xxxx --envName xxxx`

If you try to pull from an app different to what you are working on the CLI will complain.
`Amplify appId mismatch.
You are currently working in the amplify project with Id xxxx`
If you still want to proceed you need to delete the `amplify` folder.

### amplify console

The `amplify console` command launches the browser directing you to your cloud project in the AWS Amplify Console. The Amplify Console provides a central location for development teams to view and manage their backend environments, status of the backend deployment, deep-links to the backend resources by Amplify category, and instructions on how to pull, clone, update, or delete environments.

### amplify configure project

The `amplify configure project` command is an advanced command and not commonly used for initial getting started projects. The command should be used to modify the project configuration present in the `.config/` directory and re-configuring AWS credentials (based on profile on your local machine) set up during the `amplify init` step. The `.config/` directory is generated in the `amplify/` directory, if not already present, and the `local-aws-info.json`, `local-env-info.json` and `project-info.json` files are configured to reflect the selections made as a part of the `amplify configure project` command.

`amplify configure project` is also used to enable **Serverless Container** options in your project with Amazon Elastic Container Service. When enabled, you will be able to build APIs with both AWS Lambda and AWS Fargate using a [Dockerfile](https://docs.docker.com/engine/reference/builder/) or a [Docker Compose file](https://docs.docker.com/compose/compose-file/). See [Serverless Containers](~/cli/usage/containers.md) for more information.

### amplify logout --appId \<Amplify App Id\>

When Amplify CLI is authenticated with the Amplify Admin UI, JSON Web Tokens (JWTs) are stored on the developer's machine. This command will remove the JWTs associated with a particular Amplify app. The CLI will also prompt if you want to logout from all sessions. 'Yes' will remove the JWTs and ensure they are invalidated globally. 'No' will still remove the locally-stored JWTs but the tokens will remain valid until they expire.

## List of commands

- `amplify <category> <subcommand>`
- `amplify push`
- `amplify pull`
- `amplify env <subcommand>`
- `amplify configure`
- `amplify console`
- `amplify delete`
- `amplify help`
- `amplify init`
- `amplify publish`
- `amplify run`
- `amplify status`
- `amplify logout`

### Category commands

- `amplify <category> add`
- `amplify <category> update`
- `amplify <category> remove`
- `amplify <category> push`
