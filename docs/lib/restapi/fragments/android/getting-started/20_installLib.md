Expand **Gradle Scripts**, open **build.gradle (Module: app)**. You will already have configured Amplify by following the steps in the [Project Setup walkthrough](~/lib/project-setup/create-application.md).

Add API by adding these libraries into the `dependencies` block:
```groovy
dependencies {
    implementation 'com.amplifyframework:aws-api:1.18.0'
    implementation 'com.amplifyframework:aws-auth-cognito:1.18.0'

}
```

Click **Sync Now**.
