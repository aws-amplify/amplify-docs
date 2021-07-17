<amplify-block-switcher>
<amplify-block name="Java">

```java
Amplify.Auth.fetchAuthSession(
    result -> {
        AWSCognitoAuthSession cognitoAuthSession = (AWSCognitoAuthSession) result;
            switch(cognitoAuthSession.getIdentityId().getType()) {
                case SUCCESS:
                    Log.i("AuthQuickStart", "IdentityId: " + cognitoAuthSession.getIdentityId().getValue());
                    break;
                case FAILURE:
                    Log.e("AuthQuickStart", "IdentityId not present because: " + cognitoAuthSession.getIdentityId().getError().toString());
            }
        },
        error -> Log.e("AuthQuickStart", error.toString())
);
```

</amplify-block>
<amplify-block name="Kotlin - Callbacks">

```kotlin
Amplify.Auth.fetchAuthSession(
    {
        val session = it as AWSCognitoAuthSession
        when (session.identityId.type) {
            AuthSessionResult.Type.SUCCESS ->
                Log.i("AuthQuickStart", "IdentityId = ${session.identityId.value}")
            AuthSessionResult.Type.FAILURE ->
                Log.e("AuthQuickStart", "IdentityId not found", session.identityId.error)
        }
    },
    { Log.e("AuthQuickStart", "Failed to fetch session", it) }
)
```

</amplify-block>
<amplify-block name="Kotlin - Coroutines (Beta)">

```kotlin
try {
    val session = Amplify.Auth.fetchAuthSession() as AWSCognitoAuthSession
    val id = session.identityId
    if (id.type == AuthSessionResult.Type.SUCCESS) {
        Log.i("AuthQuickStart", "IdentityId: ${id.value}")
    } else if (id.type == AuthSessionResult.Type.FAILURE) {
        Log.e("AuthQuickStart", "IdentityId not present: ${id.error}")
    }
} catch (error: AuthException) {
    Log.e("AuthQuickStart", "Failed to fetch session", error)
}
```

</amplify-block>
<amplify-block name="RxJava">

```java
RxAmplify.Auth.fetchAuthSession()
    .subscribe(
        result -> {
            AWSCognitoAuthSession cognitoAuthSession = (AWSCognitoAuthSession) result;

            switch (cognitoAuthSession.getIdentityId().getType()) {
                case SUCCESS:
                    Log.i("AuthQuickStart", "IdentityId: " + cognitoAuthSession.getIdentityId().getValue());
                    break;
                case FAILURE:
                    Log.e("AuthQuickStart", "IdentityId not present because: " + cognitoAuthSession.getIdentityId().getError().toString());
            }
        },
        error -> Log.e("AuthQuickStart", error.toString())
    );
```

</amplify-block>
</amplify-block-switcher>
