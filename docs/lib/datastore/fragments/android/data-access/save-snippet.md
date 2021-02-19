<amplify-block-switcher>
<amplify-block name="Java">

```java
Post post = Post.builder()
    .title("My First Post")
    .rating(10)
    .status(PostStatus.PUBLISHED)
    .build();

Amplify.DataStore.save(post,
    saved -> Log.i("MyAmplifyApp", "Saved a post."),
    failure -> Log.e("MyAmplifyApp", "Save failed.", failure)
);
```

</amplify-block>
<amplify-block name="Kotlin">

```kotlin
val post = Post.builder()
    .title("My First Post")
    .rating(10)
    .status(PostStatus.PUBLISHED)
    .build()
try {
    Amplify.DataStore.save(post)
    Log.i("MyAmplifyApp", "Saved a post.")
} catch (error: DataStoreException) {
    Log.e("MyAmplifyApp", "Save failed.", error)
)
```

</amplify-block>
<amplify-block name="RxJava">

```java
Post post = Post.builder()
    .title("My First Post")
    .rating(10)
    .status(PostStatus.PUBLISHED)
    .build();

RxAmplify.DataStore.save(post)
    .subscribe(
        () -> Log.i("MyAmplifyApp", "Saved a post."),
        failure -> Log.e("MyAmplifyApp", "Save failed.", failure)
    );
```

</amplify-block>
</amplify-block-switcher>
