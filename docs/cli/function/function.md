---
title: Overview
description: function
---

## Set up a function

You can add a Lambda function to your project which you can use alongside a REST API or as a datasource, as a part of your GraphQL API using the `@function` directive. 
```terminal
$ amplify add function
? Provide a friendly name for your resource to be used as a label for this category in the project: lambdafunction
? Provide the AWS Lambda function name: lambdafunction
? Choose the function template that you want to use: (Use arrow keys)
❯ Hello world function
  CRUD function for Amazon DynamoDB table (Integration with Amazon API Gateway and Amazon DynamoDB)
  Serverless express function (Integration with Amazon API Gateway)
```

## Function templates

* The `Hello World function` would create a basic hello world Lambda function
* The `CRUD function for Amazon DynamoDB table (Integration with Amazon API Gateway and Amazon DynamoDB)` function would add a predefined [serverless-express](https://github.com/awslabs/aws-serverless-express) Lambda function template for CRUD operations to DynamoDB tables (which you can create by following the CLI prompts or use the tables which you've already configured using the `amplify add storage` command)
* The `Serverless express function (Integration with Amazon API Gateway) ` would add a predefined [serverless-express](https://github.com/awslabs/aws-serverless-express) Lambda function template with routing enabled for your REST API paths.

You can update the Lambda execution role policies for your function to access other resources generated and maintained by the CLI, using the CLI

```bash
$ amplify update function
Please select the Lambda Function you would want to update: lambdafunction
? Do you want to update permissions granted to this Lambda function to perform on other resources in your project? Yes
? Select the category (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ api
 ◯ function
 ◯ storage
 ◯ auth
? Select the operations you want to permit for betatest (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ create
 ◯ read
 ◯ update
 ◯ delete

You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiBetatestGraphQLAPIIdOutput = process.env.API_BETATEST_GRAPHQLAPIIDOUTPUT
var apiBetatestGraphQLAPIEndpointOutput = process.env.API_BETATEST_GRAPHQLAPIENDPOINTOUTPUT
```

Behind the scenes, the CLI automates populating of the resource identifiers for the selected resources as Lambda environment variables which you will see in your function code as well. This process additionally configures CRUD level IAM policies on the Lambda execution role to access these resources from the Lambda function. For instance, you might grant permissions to your Lambda function to read/write to a DynamoDB table in the Amplify project by using the above flow and the appropriate IAM policy would be set on that Lambda function's execution policy which is scoped to that table only.

## GraphQL from Lambda

You can use a Lambda function to call your GraphQL API. For example, deploy a simple `Todo` model with the following schema in the `amplify add api` flow:

```
type Todo @model @auth (
    rules: [
        { allow: private, provider: iam, operations: [create] }
    ]
) {
  id: ID!
  name: String
  description: String
}
```

In the above example we want your Lambda function to have access to run a single mutation (`createTodo`) and hence we explicitly mention `create` in the `operations` list. To grant access for application users to perform other actions, you can add `read`, `update` or `delete` to the `operations` list along with `create`.

Save your changes and create a Lambda function with `amplify add function` and make sure to add access for your GraphQL API when prompted for in the `amplify add function` flow. The CLI would automatically configure the Lambda execution IAM role required by the Lambda function to call the GraphQL API. The following function will sign the request and use environment variables for the AppSync and Region that `amplify add function` created for you.

```javascript
const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_BACKENDGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require('./query.js').mutation;
const apiKey = process.env.API_KEY;

exports.handler = async (event) => {
    const req = new AWS.HttpRequest(appsyncUrl, region);

    const item = {
        input: {
            name: "Lambda Item",
            description: "Item Generated from Lambda"
        }
    };

    req.method = "POST";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: graphqlQuery,
        operationName: "createTodo",
        variables: item
    });

    if (apiKey) {
        req.headers["x-api-key"] = apiKey;
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
            result.on('data', (data) => {
                resolve(JSON.parse(data.toString()));
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });

    return {
        statusCode: 200,
        body: data
    };
};
```

Finally you can define the GraphQL operation you're running, in this case the `createTodo` mutation, in a separate `query.js` file:

```javascript
module.exports = {
    mutation: `mutation createTodo($input: CreateTodoInput!) {
      createTodo(input: $input) {
        id
        name
        description
      }
    }
    `
}
```