The Amplify Auth category provides an interface for authenticating a user. Behind the scenes, it provides the necessary authorization to the other Amplify categories. It comes with default, built-in support for [Amazon Cognito](https://aws.amazon.com/cognito) User Pool and Identity Pool. The Amplify CLI helps you to create and configure the auth category with an authentication provider.

## Goal
To setup and configure your application with Amplify Auth and go through a simple api to check the current auth session

## Prerequisites

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/10_preReq.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/10_preReq.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/10_preReq.md"></inline-fragment>

## Configure Auth Category

To start provisioning auth resources in the backend, go to your project directory and **execute the command**:

```bash
amplify add auth
```

Enter the following when prompted:
```console
? Do you want to use the default authentication and security configuration?
    `Default configuration`
? How do you want users to be able to sign in?
    `Username`
? Do you want to configure advanced settings?
    `No, I am done.`
```

To push your changes to the cloud, **execute the command**:

```bash
amplify push
```

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/12_amplifyConfig.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/12_amplifyConfig.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/12_amplifyConfig.md"></inline-fragment>

## Install Amplify Libraries

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/20_installLib.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/20_installLib.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/20_installLib.md"></inline-fragment>

## Initialize Amplify Auth
<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/30_initAuth.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/30_initAuth.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/getting_started/30_initAuth.md"></inline-fragment>

## Check the current auth session

We can now check the current auth session.

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/40_fetchSession.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/getting_started/40_fetchSession.md"></inline-fragment>

The `isSignedIn` property of the authSession will be false since we haven't signed in to the category yet.

## Next Steps
Congratulations! You've successfully setup AWS Cognito Auth plugin.  Check out the following links to see other Amplify Auth use cases:

* [Authenticate a user with username password](~/lib/auth/signin.md)
* [Authenticate a user using a web UI](~/lib/auth/signin_web_ui.md)
* [Authenticate a user with another auth provider](~/lib/auth/social_signin_web_ui.md)
