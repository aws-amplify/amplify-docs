---
title: Node Version Update
description: Upgrading from NodeJS 8.10 to NodeJS 10.x
---

## Node.js 8.10 to Node.js 10.x

According to AWS Lambda [Runtime Support Policy](https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html), AWS Lambda deprecates Node.js runtime Node.js 8.10 on January 6th, 2020.

The Amplify CLI code base has been updated to reflect this change. Amplify CLI replaces Node.js 8.10 with Node.js 10 in the Lambda functions that it creates for you. If you use Amplify CLI version 4.10.0 and above to create new aws resources, this does not concern you.

However, if you have used previous versions of the Amplify CLI to create AWS resources in the following categories,
you will need to manually update your project artifacts to avoid NodeJS runtime upgrade issues with AWS Lambda.

- auth
- function
- interactions

Before you make the following manual changes, please make sure to back up your entire project.

After you make the following manual changes, run `amplify push` to update the AWS Lambda functions in the cloud.

### auth

Auth category allows you to add/configure Lambda Triggers for cognito, such as PostAuthentication and PostConfirmation using amplify add/update auth command.
Lambda triggers are stored as a part of the functions category under the `amplify/function/<prefix><TriggerName>/src` directory.

In the index files for the Lambda Triggers, Located in `amplify/function/<prefix><TriggerName>/src/index.js`

Replace

```js
//...
const { handler } = require(`${modules[i]}`);
//...
```

With

```js
//...
const { handler } = require(`./${modules[i]}`);
//...
```

### function

If you use NodeJS [`require`](https://nodejs.org/dist/latest-v12.x/docs/api/modules.html#modules_require_id) to import local modules, relative path is needed to specify the local module's location.
However, we have noticed that you can just use the module name to require them with `nodejs8.10` runtime on AWS Lambda Functions.
But with the `nodejs10.x` runtime, it is not allowed anymore. AWS Lambda Function will throw an error complaining that it can not find the module, and you have to provide the relative path instead of just the module name to require a local module.
So, if you added resources in the `function` category, and you did not specify relative path to require local modules, you need to update the code base just like the above section for the auth triggers.

### interactions

In the `<project-root>/amplify/backend/interactions/<resource-name>/src/index.js` file

Replace

```js
const response = require('cfn-response');
//...
```

With

```js
const response = require('./cfn-response');
//...
```

### runtime string replacement

With the latest version of the Amplify CLI (> 4.7.0), when you execute any `amplify` command on a project initialized by CLI version prior to 4.7.0, it will prompt for your confirmation to automatically upgrade your NodeJS Lambda runtime versions, from `nodejs8.10` to `nodejs10.x` in all the CloudFormation template files under the `amplify/backend` folder. If you do not confirm, you will need to manually carry out such replacements. You can go to each category subdirectory, then each resource subdirectory under it, and locate the template file (it could be either `.yml` or `.json` file), the template file has `template` in its name. Then do a global string replacement of `nodejs8.10` to `nodejs10.x` in the file.

## Node.js 10.x to Node.js latest version supported by AWS
According to AWS Lambda [Runtime Support Policy](https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html), AWS Lambda deprecates Node.js runtime Node.js 10.x on August 30th, 2021.

The Amplify CLI code base has been updated to reflect this change. Amplify CLI replaces Node.js 10.x with Node.js latest version for all files that it creates for you. Migration will be done automatically by running `amplify push` command, this will prompt users to migrate from Node.js 10.x to latest Node.js runtimes as supported by AWS.List of changes are summarized below: 
- Change default project version to 3.1
- Change minimum node version to 12 for CLI and amplify-app
- Lambda functions and triggers will use 14.x by default
- Any functions/triggers/custom resource handlers using nodes.js <10.x will be migrated to 12.x(Cloudformation Custom Resource handlers does not support 14.x.)
- Enhance project version handling for migration and node migration scenarios