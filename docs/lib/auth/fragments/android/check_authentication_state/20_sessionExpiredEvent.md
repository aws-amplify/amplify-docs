<amplify-block-switcher>
<amplify-block name="Java">

```java
Amplify.Hub.subscribe(HubChannel.AUTH,
        hubEvent -> {
            if (AuthChannelEventName.valueOf(hubEvent.getName()) == AuthChannelEventName.SESSION_EXPIRED) {
                // User session is no longer valid, navigate to the login screen to re-authenticate the user.
                Log.i("AuthQuickstart", "Auth session just expired.");
            }
        }
);
```

</amplify-block>
<amplify-block name="Kotlin - Callbacks">

```kotlin
Amplify.Hub.subscribe(HubChannel.AUTH) { event ->
    if (AuthChannelEventName.valueOf(event.name) == AuthChannelEventName.SESSION_EXPIRED) {
        // User session is no longer valid, navigate to the login screen to re-authenticate the user.
        Log.i("AuthQuickstart", "Auth session just expired.")
    }
}
```

</amplify-block>
<amplify-block name="Kotlin - Coroutines (Beta)">

```kotlin
Amplify.Hub.subscribe(HubChannel.AUTH).collect {
    if (AuthChannelEventName.valueOf(it.name) == AuthChannelEventName.SESSION_EXPIRED) {
        // User session is no longer valid, navigate to the login screen to re-authenticate the user.
        Log.i("AuthQuickstart", "Auth session just expired.")
    }
}
```

</amplify-block>
<amplify-block name="RxJava">

```java
RxAmplify.Hub.on(HubChannel.AUTH)
        .map(HubEvent::getName)
        .subscribe(name -> {
            if (AuthChannelEventName.valueOf(name) == AuthChannelEventName.SESSION_EXPIRED) {
                // User session is no longer valid, navigate to the login screen to re-authenticate the user.
                Log.i("AuthQuickstart", "Auth session just expired.");
            }
        }
```

</amplify-block>
</amplify-block-switcher>
