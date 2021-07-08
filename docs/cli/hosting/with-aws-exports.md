---
title: Continuous deployment
description: The way how to find aws-exports.js in Build step of "Continuous deployment" configuration
---

The way how to find `aws-exports.js` in your Amplify Project in Console's **Build image** if you configure "Continuous deployment" configuration.

## Configure Amplify credential in Build image

The Default Build image in Amplify Console, no credential settings configured. so if your project needs `aws-exports.js` in build step, you need to configure your amplify's credential and pull the backend environments via `amplify pull`.

This describes the way how to pull the backend environments setting [Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html) in Amplify Console and using amplify pull [Headless mode CLI](https://docs.amplify.aws/cli/usage/headless#amplify-pull-parameters).

### Setting Environment Variables in Console

We're gonna execute [Headless mode CLI](https://docs.amplify.aws/cli/usage/headless#amplify-pull-parameters) with parameters to pull the backend environments, and We use `Environment Variables` as a parameters through [accessing environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html#access-env-vars).

Go to the [Amplify Console](https://console.aws.amazon.com/amplify/), choose `App settings -> Environment Variables`. after that choose `Manage variables`.

![Environment Variables in Amplify Console](https://docs.aws.amazon.com/amplify/latest/userguide/images/envvars.png)

The **Variables** we will refer to is this:

- PROJECT_NAME
- AWS_APP_ID (is Amplify's Console environment variables. so you don't need to add this)
- ENV_NAME
- ACCESS_KEY_ID
- SECRET_ACCESS_KEY
- REGION

fill the **Value**s of your project.
(You can also input other Variables and refer the [Amplify Console environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html#amplify-console-environment-variables).)

### Pull the backend environments via Headless mode CLI

First, make the shell script to execute `amplify pull`.

Assume that we make **amplify-pull.sh** in root of our project.

**amplify-pull.sh (sample script)**

<!--cSpell:disable-->
```sh
#!/usr/bin/env bash

AMPLIFY="'{\
\"projectName\":\"${PROJECT_NAME}\",\
\"appId\":\"${AWS_APP_ID}\",\
\"envName\":\"${ENV_NAME}\",\
\"defaultEditor\":\"code\"\
}'"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"${ACCESS_KEY_ID}\",\
\"secretAccessKey\":\"${SECRET_ACCESS_KEY}\",\
\"region\":\"${REGION}\"\
}"
PROVIDERS="'{\
\"awscloudformation\":${AWSCLOUDFORMATIONCONFIG}\
}'"

cmd="amplify pull --amplify ${AMPLIFY} --providers ${PROVIDERS} --yes"
echo $cmd
eval $cmd
```

and add some codes that execute shell script in [**amplify.yml**](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html).

**amplify.yml**

```yaml
version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - chmod +x amplify-pull.sh
        - ./amplify-pull.sh
    build:
      commands:
        - find . -name "aws-exports.js" # <- you can find where the "aws-exports.js" is.
        - yarn
        - yarn build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths: []
```
