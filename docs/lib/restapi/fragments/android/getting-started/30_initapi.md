To initialize the Amplify Auth and API categories you call `Amplify.addPlugin()` method for each category. To complete initialization call `Amplify.configure()`.

Add the following code to your `onCreate()` method in your application class:

<amplify-block-switcher>
<amplify-block name="Java">

```java
Amplify.addPlugin(new AWSApiPlugin());
```

Your class will look like this:

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add these lines to add the AWSApiPlugin and Auth plugin
            Amplify.addPlugin(new AWSApiPlugin());
            Amplify.addPlugin(AWSCognitoAuthPlugin());
            Amplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify.");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify.", error);
        }
    }
}
```

</amplify-block>
<amplify-block name="Kotlin">

```kotlin
Amplify.addPlugin(AWSApiPlugin())
Amplify.addPlugin(AWSCognitoAuthPlugin())
```

Your class will look like this:

```kotlin
class MyAmplifyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            // Add these lines to add the AWSApiPlugin and Auth plugin
            Amplify.addPlugin(AWSApiPlugin())
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.configure(applicationContext)

            Log.i("MyAmplifyApp", "Initialized Amplify.")
        } catch (error: AmplifyException) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify.", error)
        }
    }
}
```

</amplify-block>
<amplify-block name="RxJava">

```java
RxAmplify.addPlugin(new AWSApiPlugin());
```

Your class will look like this:

```java
public class MyAmplifyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // Add these lines to add the AWSApiPlugin and Auth plugin
            RxAmplify.addPlugin(new AWSApiPlugin());
            RxAmplify.addPlugin(AWSCognitoAuthPlugin());
            RxAmplify.configure(getApplicationContext());

            Log.i("MyAmplifyApp", "Initialized Amplify.");
        } catch (AmplifyException error) {
            Log.e("MyAmplifyApp", "Could not initialize Amplify.", error);
        }
    }
}
```

</amplify-block>
</amplify-block-switcher>
