---
title: Overview
description: Use Amplify CLI to create and manage cloud-connected file & data storage for your app.
---

Amplify CLI's `storage` category enables you to create and manage cloud-connected file & data storage. Use the `storage` category when you need to store:

1. app content (images, audio, video etc.) in a public, protected or private storage bucket or
2. app data in a NoSQL database and access it with a REST API + Lambda

## Setup a new storage resource

You can setup a new storage resource by running the following command:

```bash
amplify add storage
```

Amplify allows you to either setup app content storage (images, audio, video etc.) backed by Amazon S3 or a NoSQL database backed by Amazon DynamoDB.

### Adding S3 storage

```console
? Please select from one of the below mentioned services:
> Content (Images, audio, video, etc.)
  NoSQL Database
? Please provide a friendly name for your resource that will be used to label this category in the project:
> mystorage
? Please provide bucket name:
> mybucket
```

Follow the prompts to provide your content storage's resource name.

### S3 Access permissions

Next, configure the access permissions for your Amazon S3 bucket. If you haven't set up the `auth` category already, the Amplify CLI will guide you through a workflow to enable the `auth` category.

```console
? Restrict access by?
> Auth/Guest Users
  Individual Groups
  Both
  Learn more
```

#### Auth/Guest Users access

Select `Auth/Guest Users`, to scope permissions based on an individual user's authentication status. On the next question you'll be able to select if only authenticated users can access resources, or authenticated and guest users:

```
? Who should have access:
❯ Auth users only
  Auth and guest users
```

Then you'll be prompted to set the access scopes for your authenticated and (if selected prior) unauthenticated users.

```console
? What kind of access do you want for Authenticated users?
> ◉ create/update
  ◯ read
  ◯ delete
? What kind of access do you want for Guest users?
  ◯ create/update
> ◉ read
  ◯ delete
```

Granting access to authenticated users will allow the specified CRUD operations on objects in the bucket starting with the prefix `/public/`, `/protected/{cognito:sub}/`, and `/private/{cognito:sub}/`. `{cognito:sub}` is the sub of the Cognito identity of the authenticated user.

Granting access to guest users will allow the specified CRUD operations on objects in the bucket starting with the prefix `/public/`.

#### Individual Group access
Select `Individual Groups` to scope access permissions based on [Cognito User Groups](~/cli/auth/groups.md)

```console
? Select groups:
  ◉ EMPLOYEE
> ◉ MANAGER
```
Then select the CRUD operations you want to permit for each selected Cognito user group
```console
? What kind of access do you want for EMPLOYEE users?
  ◯ create/update
> ◉ read
  ◯ delete
? What kind of access do you want for MANAGER users?
  ◉ create/update
  ◯ read
> ◉ delete
```
> Note: CRUD operations selected here will apply to ALL objects in the bucket, not just objects under a particular prefix.

> Note: If you combine `Auth/Guest user access` and `Individual Group access`, users who are members of a group will only be granted the permissions of the group, and not the authenticated user permissions.

### S3 Lambda trigger
Lastly, you have the option of configuring a Lambda function that can execute in response to S3 events.

```console
? Do you want to add a Lambda Trigger for your S3 Bucket? (y/N)
```

Learn more about this workflow [here](~/cli/usage/lambda-triggers.md#s3-lambda-triggers).

That's it! Your content storage is set up! Head to the [library's storage docs](~/lib/storage/getting-started.md) to integrate this newly created S3 bucket into your app.

### Adding a NoSQL database

```console
? Please select from one of the below mentioned services:
> Content (Images, audio, video, etc.)
  NoSQL Database
? Please provide a friendly name for your resource that will be used to label this category in the project:
> dynamo2e1dc4eb
? Please provide table name:
> dynamo2e1dc4eb
```

Follow the prompts to provide your NoSQL Database's resource name. Next, you'll go through a table-creation wizard. First, you'll create the columns of your table:

```console
You can now add columns to the table.

? What would you like to name this column: id
? Please choose the data type: string
? Would you like to add another column? Yes
```

Then, you'll need to specify your indexes. The concept behind "indexes", "partition key", "sort key" and "global secondary indexes" are explained in-depth [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey).

```console
? Please choose partition key for the table: id
? Do you want to add a sort key to your table? (y/N)
```

```console
? Do you want to add a Lambda Trigger for your Table? (y/N)
```

If you want to configure a Lambda trigger for your Table, you'll have the option. Learn more about this workflow [here](~/cli/usage/lambda-triggers.md#dynamodb-lambda-triggers).

That's it! Your NoSQL Database is set up!
