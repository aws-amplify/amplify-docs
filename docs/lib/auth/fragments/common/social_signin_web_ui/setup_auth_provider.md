## Setup Your Auth Provider

<amplify-block-switcher>
<amplify-block name="Facebook Login">

1. Create a [developer account with Facebook](https://developers.facebook.com/docs/facebook-login).

2. [Sign In](https://developers.facebook.com/) with your Facebook credentials.

3. From the *My Apps* menu, choose *Add New App*.
![Image](~/images/cognitoHostedUI/facebook1.png)

4. Give your Facebook app a name and choose *Create App ID*.
![Image](~/images/cognitoHostedUI/facebook2.png)

5. On the left navigation bar, choose *Settings* and then *Basic*.
![Image](~/images/cognitoHostedUI/facebook3.png)

6. Note the *App ID* and the *App Secret*. You will use them in the next section in the CLI flow.

</amplify-block>
<amplify-block name="Google Sign-In">

1. Go to the [Google developer console](https://console.developers.google.com).
2. On the left navigation bar, choose *Credentials*.
![Image](~/images/cognitoHostedUI/google5.png)
3. Create your OAuth2.0 credentials by choosing *OAuth client ID* from the *Create credentials* drop-down list.
![Image](~/images/cognitoHostedUI/google6.png).
4. Choose *Web application*.
5. Click *Create*.
6. Note the *OAuth client ID* and *client secret*. You will need them for the next section in the CLI flow.
7. Choose *OK*.

</amplify-block>
<amplify-block name="Login with Amazon">

1. Create a [developer account with Amazon](https://developer.amazon.com/login-with-amazon).
2. [Sign in](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html) with your Amazon credentials.
3. You need to create an Amazon security profile to receive the Amazon client ID and client secret. Choose Create a Security Profile.
![Image](~/images/cognitoHostedUI/amazon1.png)
4. Type in a Security Profile Name, a Security Profile Description, and a Consent Privacy Notice URL.
![Image](~/images/cognitoHostedUI/amazon2.png)
5. Choose Save.
6. Choose Client ID and Client Secret to show the client ID and secret. You will need them for the next section in the CLI flow.
![Image](~/images/cognitoHostedUI/amazon3.png)

</amplify-block>

<amplify-block name="Sign in with Apple">

1. [Sign In](https://developer.apple.com/account/) with your Apple developer credentials.
2. On the main developer portal page, select **Certificates, IDs, & Profiles**.
3. On the left navigation bar, select **Identifier**.
4. On the Identifiers page, select the **+** icon.
5. On the Register a New Identifier page, select **App IDs**.
6. On the Register an App ID page, under App ID Prefix, take note of the Team ID value.
7. Provide a description in the Description text box and provide the bundleID of the iOS app.
![Image](~/images/cognitoHostedUI/apple1.png)
8. Under Capabilities, select Sign in with Apple.
9. Select **Continue**, review the configuration, and then select **Register**.
10. On the Identifiers page, on the right, select **App IDs**, and then select **Services ID**.
11. Select the **+** icon and, on the Register a New Identifier page, select **Services IDs**.
12. Provide a description in the *Description* text box and provide an identifier for the service id.
![Image](~/images/cognitoHostedUI/apple2.png)
13. Continue and register the service id.

</amplify-block>
</amplify-block-switcher>