---
title: Overview
description: Use Amplify CLI's simple guided workflow to add REST APIs to cloud-based web and mobile apps.
---

The Amplify CLI provides a guided workflow to easily add, develop, test and manage REST APIs to access your AWS resources from your web and mobile applications.

A REST API or HTTP endpoint will be composed by one or more paths. Eg: `/items`. Each path will use a Lambda function to handle HTTP requests and responses. Amplify CLI creates a single resource in Amazon API Gateway so you can handle all routes, HTTP Methods and paths, with a single Lambda function via a Lambda Proxy integration. HTTP proxy integrations forward all requests and responses directly through to your HTTP endpoint.

Amplify CLI let's you choose either an existing Lambda function or create a new one. To kickstart your implementation, you can choose between the following templates:

- Serverless ExpressJS function
- CRUD function for DynamoDB

> Lambda templates use [serverless-express](https://github.com/awslabs/aws-serverless-express) and provide the building blocks to start your REST API development.

> See the list of all [supported Lambda runtimes](~/cli/function/function.md).

Amplify CLI allows you to restrict REST API access to

- Only authenticated users; or
- Authenticated and Guest users

See a description of these user types below

| User type | Description |
|---|---|
| Authenticated user | User needs to sign in to use the REST API |
| Guest user | User doesn't need to sign in to use the REST API |

For each user type you can further specify what actions it has access to.

| User type  | Actions | Http Method | Authentication Provider  |
|---|---|---|---|
| Authenticated user | create, read, update, delete | POST, GET, PUT, PATCH, DELETE | Amazon Cognito |
| Guest user | create, read, update, delete | POST, GET, PUT, PATCH, DELETE | Amazon Cognito |

REST APIs have support for [multiple environments](~/cli/teams/overview.md) (e.g. dev, qa, and prod). This means that you can easily isolate different versions of your REST API by using different Amplify environments.

## Create a REST API

Navigate into the root of a JavaScript, iOS, or Android project and run:

```bash
amplify init
```

Follow the wizard to create a new app. After finishing the wizard run:

```bash
amplify add api
```

Select the following options:

- Please select from one of the below mentioned services: __REST__
- Provide a friendly name for your resource to be used as a label for this category in the project: __itemsApi__
- Provide a path (e.g., /book/{isbn}): __/items__

This will be the configuration for `/items` path in API Gateway:

```console
/                        
 |_ /items               Main resource. Eg: /items
    ANY                    Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
    OPTIONS                Allow pre-flight requests in CORS by browser
    |_ /{proxy+}         Proxy resource. Eg: /items/, /items/id, items/object/{id}
       ANY                  Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
       OPTIONS              Allow pre-flight requests in CORS by browser
```

By default Amplify CLI creates a greedy path variable `/items/{proxy+}` that catches all child resources for a path and forwards them to your Lambda. This will match all child routes including `/items/id` and `/items/object/id`.

- Choose a Lambda source __Create a new Lambda function__
- Provide a friendly name for your resource to be used as a label for this category in the project: __itemsLambda__
- Provide the AWS Lambda function name: __itemsLambda__
- Choose the runtime that you want to use: __NodeJS__
- Choose the function template that you want to use: __Serverless ExpressJS function__

The Lambda function template __Serverless ExpressJS function__ implements route handlers for `GET`, `POST`, `PUT` and `DELETE` Http Methods and paths for `/items` and `/items/*`. Some possible routes examples include:

```console
GET /items         List all items
GET /items/1       Load an item by id
POST /items        Create an item
PUT /items         Update an item
DELETE /items/1    Delete an item by id
```

- Do you want to access other resources in this project from your Lambda function? __No__
- Do you want to invoke this function on a recurring schedule? __No__
- Do you want to configure Lambda layers for this function? __No__
- Do you want to edit the local lambda function now? __Yes__

> We are not going to change this template but it's good that you have it open as you follow the next steps.

- Press enter to continue
- Restrict API access __Yes__
- Who should have access? __Authenticated and Guest users__
- What kind of access do you want for Authenticated users? __create, read, update, delete__
- What kind of access do you want for Guest users? __read__

Amplify CLI restricts API access combining Amazon Cognito for authentication and AWS IAM (Identity and Access Management) for granting execution permissions on routes.

- Do you want to add another path? __No__

Deploy your new API.

```bash
amplify push
```

At the end of this command you can take note of your new REST API url.

```console
REST API endpoint: https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev
```

> REST APIs follow this pattern `https://{restapi-id}.execute-api.{region}.amazonaws.com/{environment}/{path}`.

Let's see an overview of all the resources created by Amplify CLI.

```console
REST
 |_ /items (path)
    |_ itemsApi (Amazon API Gateway) 
       |_ itemsLambda (AWS Lambda)
          |_ Logs (Amazon CloudWatch)
```

## REST endpoint that triggers new Lambda functions

During the CLI setup, you'll be guided through to create a new Lambda function with a predefined [serverless-express](https://github.com/awslabs/aws-serverless-express) template with routing enabled for your REST API paths.

```bash
amplify add api
```

```console
? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/{isbn}) /items
? Choose a Lambda source Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsLambda
? Provide the AWS Lambda function name: itemsLambda
? Choose the function template that you want to use:
  CRUD function for Amazon DynamoDB
❯ Serverless ExpressJS function
```

## REST endpoint that triggers existing Lambda functions

During the CLI setup, you'll be guided through to use your own Lambda functions which you've initialized as a part of your CLI project using the `amplify add function` command. This would allow you to have custom logic in your Lambda function and not use the predefined [serverless-express](https://github.com/awslabs/aws-serverless-express) templates generated by the CLI as in the examples above.

```bash
amplify add api
```

```console
? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/{isbn}) /items
? Choose a Lambda source
  Create a new Lambda function
❯ Use a Lambda function already added in the current Amplify project
```

## Set up a REST API with Amazon DynamoDB

During the CLI setup, you'll be guided through to create a new Lambda function with a predefined [serverless-express](https://github.com/awslabs/aws-serverless-express) template with routing enabled for your REST API paths with support for CRUD operations to DynamoDB tables (which you can create by following the CLI prompts or use the tables which you've already configured using the `amplify add storage` command).

```bash
amplify add api
```

```console
? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/{isbn}) /items
? Choose a Lambda source Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsLambda
? Provide the AWS Lambda function name: itemsLambda
? Choose the function template that you want to use:
❯ CRUD function for Amazon DynamoDB
  Serverless ExpressJS function
```

In the example above with `/items` path, the following API will be created for you:

1. GET /items/[ID] will return a list containing the item at the [ID]. If the item does not exist then an empty array is returned.
2. GET /items/object/[ID] will return a single item at [ID]. If the item does not exist then an empty object is returned.
3. PUT /items with your item in the request body will create or update the item.
4. POST /items with your item in the request body will create or update the item.
5. DELETE /items/object/[ID] will delete the item.

When you have a sort key, you can append it to the end of the path, for example: `GET /items/object/[ID]/[SORT_KEY_ID]`
