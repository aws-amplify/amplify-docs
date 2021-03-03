<amplify-block-switcher>
<amplify-block name="Java">

```java
Amplify.Auth.fetchUserAttributes(
    attributes -> {
        Log.i("AuthDemo", "All user attributes = " + attributes.toString());

        // To access a specific user attribute:
        Map<AuthUserAttributeKey, String> attributesMap = new HashMap<>();
        for (AuthUserAttribute attribute : attributes) {
            attributesMap.put(attribute.getKey(), attribute.getValue());
        }
        String email = attributesMap.get(AuthUserAttributeKey.email());
        if (email != null) {
            Log.i("AuthDemo", "User email = " + email);
        }
    },
    error -> Log.e("AuthDemo", "Failed to fetch user attributes.", error)
);
```

</amplify-block>
<amplify-block name="Kotlin">

```kotlin
Amplify.Auth.fetchUserAttributes(
    { attributes ->
        Log.i("AuthDemo", "All user attributes = $attributes")

        // To access a specific user attribute:
        val attributesMap: MutableMap<AuthUserAttributeKey, String> = HashMap()
        for (attribute in attributes) {
            attributesMap[attribute.key] = attribute.value
        }
        val email = attributesMap[AuthUserAttributeKey.email()]
        if (email != null) {
            Log.i("AuthDemo", "User email = $email")
        }
    }, 
    { Log.e("AuthDemo", "Failed to fetch user attributes.", $it) }
)
```

</amplify-block>
<amplify-block name="RxJava">

```java
RxAmplify.Auth.fetchUserAttributes()
    .doOnSubscribe(() -> Log.i("AuthDemo", "Attributes:"))
    .flatMapObservable(Observable::fromIterable)
    .subscribe(
        eachAttribute -> Log.i("AuthDemo", eachAttribute.toString()),
        error -> Log.e("AuthDemo", "Failed to fetch attributes.", error)
    );
```

</amplify-block>
</amplify-block-switcher>
