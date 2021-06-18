
The Auth category can be used to register a user, confirm attributes like email/phone, and sign in with optional multi-factor authentication. It is set up to use Amazon Cognito User Pools which manages the users and their properties.

## Prerequisites

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/getting_started/10_preReq.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/common_prereq.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/common_prereq.md"></inline-fragment>

## Register a user

The default CLI flow as mentioned in the [getting started guide](~/lib/auth/getting-started.md) requires a username, password and a valid email id as parameters to register a user. Invoke the following api to initiate a sign up flow.

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/10_signUp.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/10_signUp.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/10_signUp.md"></inline-fragment>

The next step in the sign up flow is to confirm the user. A confirmation code will be sent to the email id provided during sign up. Enter the confirmation code received via email in the `confirmSignUp` call.

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/20_confirmSignUp.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/20_confirmSignUp.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/20_confirmSignUp.md"></inline-fragment>

You will know the sign up flow is complete if you see the following in your console window:

```console
Confirm signUp succeeded
```

## Force change password
If a user is required to change the password on the first login, CONFIRM_SIGN_IN_WITH_NEW_PASSWORD `AuthSignInStep` will be returned when `signIn` is called. A new password given by the user is needed in that case. It can be done using `confirmSignIn` with the new password.
Implement a UI to change password on the first login. After the user enters the username and password you can start the force change password flow by calling the following method:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/30_signIn.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/25_forceChangePassword.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/30_signIn.md"></inline-fragment>

You will know the force change password flow is complete if you see the following in your console window:

```console
AuthSignInResult{isSignInComplete=true, nextStep=AuthNextSignInStep{signInStep=DONE, additionalInfo={}, codeDeliveryDetails=null}}
```

## Sign in a user

Implement a UI to get the username and password from the user. After the user enters the username and password you can start the sign in flow by calling the following method:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/30_signIn.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/30_signIn.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/30_signIn.md"></inline-fragment>

You will know the sign in flow is complete if you see the following in your console window:

```console
Sign in succeeded
```

You have now successfully registered a user and authenticated with that user's username and password with Amplify. The Authentication category supports other mechanisms for authentication such as web UI based sign in, sign in using other providers etc that you can explore in the other sections.

## Multi-factor authentication

Some steps in setting up multi-factor authentication can only be chosen during the initial setup of Auth. If you have already added Auth via the CLI, navigate to your project directory in Terminal, run `amplify auth remove` and when that completes, `amplify push` to remove it.  

Now, run `amplify add auth` and setup Auth with the following options:  

```console
? Do you want to use the default authentication and security configuration? 
    `Manual configuration`
? Select the authentication/authorization services that you want to use: 
    `User Sign-Up, Sign-In, connected with AWS IAM controls (Enables per-user Storage features for images or other content, Analytics, and more)`
? Please provide a friendly name for your resource that will be used to label this category in the project: 
    `<default>`
? Please enter a name for your identity pool. 
    `<default>`
? Allow unauthenticated logins? (Provides scoped down permissions that you can control via AWS IAM) 
    `Yes`
? Do you want to enable 3rd party authentication providers in your identity pool? 
    `No`
? Please provide a name for your user pool: 
    `<default>`
Warning: you will not be able to edit these selections.
? How do you want users to be able to sign in? 
    `Username`
? Do you want to add User Pool Groups? 
    `No`
? Do you want to add an admin queries API? 
    `No`
? Multifactor authentication (MFA) user login options: 
    `ON (Required for all logins, can not be enabled later)`
? For user login, select the MFA types: 
    `SMS Text Message`
? Please specify an SMS authentication message: 
    `Your authentication code is {####}`
? Email based user registration/forgot password: 
    `Enabled (Requires per-user email entry at registration)`
? Please specify an email verification subject: 
    `Your verification code`
? Please specify an email verification message: 
    `Your verification code is {####}`
? Do you want to override the default password policy for this User Pool? 
    `No`
Warning: you will not be able to edit these selections.
? What attributes are required for signing up? 
    `Email, Phone Number (This attribute is not supported by Facebook, Login With Amazon.)`
? Specify the app's refresh token expiration period (in days): 
    `30`
? Do you want to specify the user attributes this app can read and write? 
    `No`
? Do you want to enable any of the following capabilities?
    `NA`
? Do you want to use an OAuth flow? 
    `No`
? Do you want to configure Lambda Triggers for Cognito? 
    `No`
```

When you sign up, be sure to include both email and phone attributes with the phone number formatted as follows:

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/40_multi_factor_signup.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/40_multi_factor_signup.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/40_multi_factor_signup.md"></inline-fragment>

You'll then confirm signup, sign in, and get back a nextStep in the sign in result of type `CONFIRM_SIGN_IN_WITH_SMS_MFA_CODE`.
A confirmation code will also be texted to the phone number provided above. Pass the code you received to the confirmSignIn api:

<amplify-callout>
Note that you must call confirmSignIn in the same app session as you call signIn. If you close the app, you'll need to call signIn again.
As a result, for testing purposes, you'll at least need an input field where you can enter the code sent via SMS and feed it to confirmSignIn.
</amplify-callout>

<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/signin/50_multi_factor_confirm_signin.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/signin/50_multi_factor_confirm_signin.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/auth/fragments/flutter/signin/50_multi_factor_confirm_signin.md"></inline-fragment>
