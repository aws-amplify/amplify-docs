<amplify-block-switcher>
<amplify-block name="Java">

```java
Amplify.Auth.fetchAuthSession(
    result -> {
        AWSCognitoAuthSession cognitoAuthSession = (AWSCognitoAuthSession) result;
            // Check refresh token is valid or not
            switch (cognitoAuthSession.getUserPoolTokens().getType()) {
                case SUCCESS:
                    Log.i("AuthQuickStart", "Refresh token is valid.");
                    break;
                case FAILURE:
                    // User is no longer authenticated, display the login screen for the user to re-authenticate
                    Log.e("AuthQuickStart", "Refresh token expired. User must re-authenticate by signing in again.", cognitoAuthSession.getUserPoolTokens().getError());
            }
    },
    error -> Log.e("AuthQuickstart", "Failed to determine user sign-in state" + error.toString())
);
```

</amplify-block>
<amplify-block name="Kotlin - Callbacks">

```kotlin
Amplify.Auth.fetchAuthSession(
    {
        val cognitoAuthSession = it as AWSCognitoAuthSession
        // Check refresh token is valid or not
        when (cognitoAuthSession.userPoolTokens.type) {
            AuthSessionResult.Type.SUCCESS ->
                Log.i("AuthQuickStart", "Refresh token is valid.")
            AuthSessionResult.Type.FAILURE -> 
                // User is no longer authenticated, display the login screen for the user to re-authenticate
                Log.e(
                    "AuthQuickStart",
                    "Refresh token expired. User must re-authenticate by signing in again." + cognitoAuthSession.userPoolTokens.error
                )
        }
    },
    { Log.e("AuthQuickStart", "Failed to fetch session", it) }
)
```

</amplify-block>
<amplify-block name="Kotlin - Coroutines (Beta)">

```kotlin
try {
    val result = Amplify.Auth.fetchAuthSession()
    val cognitoAuthSession = result as AWSCognitoAuthSession
    // Check refresh token is valid or not
    when (cognitoAuthSession.userPoolTokens.type) {
        AuthSessionResult.Type.SUCCESS ->
            Log.i("AuthQuickStart", "Refresh token is valid.")
        AuthSessionResult.Type.FAILURE -> 
                // User is no longer authenticated, display the login screen for the user to re-authenticate
                Log.e(
                    "AuthQuickStart",
                    "Refresh token expired. User must re-authenticate by signing in again." + cognitoAuthSession.userPoolTokens.error
                )
    }
} catch (error: AuthException) {
    Log.e("AuthQuickStart", "Failed to fetch Auth session", error)
}
```

</amplify-block>
<amplify-block name="RxJava">

```java
RxAmplify.Auth.fetchAuthSession()
    .subscribe(
            result -> {
                AWSCognitoAuthSession cognitoAuthSession = (AWSCognitoAuthSession) result;
                // Check refresh token is valid or not
                switch (cognitoAuthSession.getUserPoolTokens().getType()) {
                    case SUCCESS:
                        Log.i("AuthQuickStart", "Refresh token is valid.");
                        break;
                    case FAILURE:
                        // User is no longer authenticated, display the login screen for the user to re-authenticate
                        Log.e("AuthQuickStart", "Refresh token expired. User must re-authenticate by signing in again.", cognitoAuthSession.getUserPoolTokens().getError());
                }
            },
            error -> Log.e("AuthQuickstart", "Failed to fetch AuthSession" + error.toString())
    );
```

</amplify-block>
</amplify-block-switcher>
