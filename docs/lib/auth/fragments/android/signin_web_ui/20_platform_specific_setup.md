## Update AndroidManifest.xml

<amplify-block-switcher>
<amplify-block name="v1.17.8+">
Add the following activity to your app's `AndroidManifest.xml` file, replacing `myapp` with
your redirect URI prefix if necessary:

```xml
<activity
    android:name="com.amplifyframework.auth.cognito.activities.HostedUIRedirectActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" />
    </intent-filter>
</activity>
```
  
If your app is targeting API level 30 or above, add the following queries section on the top level to `AndroidManifest.xml`.

```xml
<queries>
    <intent>
        <action android:name=
            "android.support.customtabs.action.CustomTabsService" />
    </intent>
</queries>
```

You may now skip the instructions below for adding a response handler to your activity.

</amplify-block>
<amplify-block name="v1.17.7 and below">
**Note:** These versions have known issues with sign-out after signing in via web UI.
Please update to the latest version and follow the updated instructions for best results.

Add the following activity to your app's `AndroidManifest.xml` file, replacing `myapp` with
whatever value you used for your redirect URI prefix:

```xml
<activity
    android:name="com.amazonaws.mobileconnectors.cognitoauth.activities.CustomTabsRedirectActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" />
    </intent-filter>
</activity>
```

<amplify-callout>
These instructions have been updated since version 1.2.0. If you set this up for a version of Amplify prior to 1.2.0, be sure to remove the `intent-filter` with `android:scheme` from your own activity as well as the `singleInstance` launch mode.
</amplify-callout>

</amplify-block>
</amplify-block-switcher>

### Add Response Handler
<amplify-callout>
If you are using a version of Amplify 1.17.8 or above and have already declared HostedUIRedirectActivity in your manifest file, then you may skip this step.
</amplify-callout>

Add the following result handler to whichever `Activity` you are calling HostedUI from:

<amplify-block-switcher>
<amplify-block name="Java">

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode == AWSCognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        Amplify.Auth.handleWebUISignInResponse(data);
    }
}
```

</amplify-block>
<amplify-block name="Kotlin - Callbacks">

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)

    if (requestCode == AWSCognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        Amplify.Auth.handleWebUISignInResponse(data)
    }
}
```

</amplify-block>
<amplify-block name="Kotlin - Coroutines (Beta)">

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)

    if (requestCode == AWSCognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        Amplify.Auth.handleWebUISignInResponse(data)
    }
}
```

</amplify-block>
<amplify-block name="RxJava">

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode == AWSCognitoAuthPlugin.WEB_UI_SIGN_IN_ACTIVITY_CODE) {
        RxAmplify.Auth.handleWebUISignInResponse(data);
    }
}
```

 </amplify-block>
</amplify-block-switcher>

<amplify-callout>
If you set this up for a version of Amplify prior to 1.2.0, be sure to remove the `onNewIntent` method code from your `Activity` that was previously specified.
</amplify-callout>
