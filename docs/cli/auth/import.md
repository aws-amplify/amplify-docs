---
title: Use an existing Cognito User Pool and Identity Pool
description: Configure the Amplify CLI to use existing Amazon Cognito User Pool and Identity resources as an authentication & authorization mechanism for other Amplify categories. (API, Storage, and more)
---

Import existing Amazon Cognito resources into your Amplify project. Get started by running `amplify import auth` command to search for & import an existing Cognito User Pool & Identity Pool in your account. 

The `amplify import auth` will:
* automatically populate your Amplify Library configuration files (aws-exports.js, amplifyconfiguration.json) with your chosen Amazon Cognito resource information 
* provide your designated existing Cognito resource as the authentication & authorization mechanism for all auth-dependent categories (API, storage and more)
* enable Lambda functions to access the chosen Cognito resource if you permit it

Make sure to run `amplify push` to complete the import process and deploy this backend change to the cloud. 

This feature is particularly useful if you're trying to:
* enable Amplify categories (such as API, storage, and function) for your existing user base;
* incrementally adopt Amplify for your application stack;
* independently manage Cognito resources while working with Amplify.

## Import an existing Cognito User Pool

Select the "Cognito User Pool only" option when you've run `amplify import auth`. In order to successfully import your User Pool, your User Pools require at least two app clients with the following conditions:
- *One "Web app client"*: an app client **without** a client secret
- *One "Native app client*": an app client **with** a client secret

Run `amplify push` to complete the import procedure.

## Import an existing Identity Pool

Select the "Cognito User Pool and Identity Pool" option when you've run `amplify import auth`. In order to successfully import your Identity Pool, it must have a User Pool fulfilling [these requirements](#import-an-existing-cognito-user-pool) associated as an authentication provider.

Run `amplify push` to complete the import procedure.

## Multi-environment support

When you create a new environment through `amplify env add`, Amplify CLI will assume by default that you're managing your app's Cognito resources outside of an Amplify project. You'll be asked to either import a different Cognito resource or maintain the same Cognito resource for your app's auth category.

If you want to have Amplify manage your auth resources in a new environment, run `amplify remove auth` to unlink the imported Cognito resource and `amplify add auth` to create new Amplify-managed auth resources.

## Unlink an existing Cognito User Pool or Identity Pool

In order to unlink your existing Cognito resource run `amplify remove auth`. This will only unlink the Cognito resource reference from the Amplify project. It will not remove the Cognito resource itself. 

Run `amplify push` to complete the unlink procedure.