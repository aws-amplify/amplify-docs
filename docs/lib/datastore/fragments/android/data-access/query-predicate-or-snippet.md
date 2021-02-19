<amplify-block-switcher>
<amplify-block name="Java">

```java
Amplify.DataStore.query(
    Post.class,
    Where.matches(Post.RATING.gt(4).or(Post.STATUS.eq(PostStatus.PUBLISHED))),
    posts -> {
        while (posts.hasNext()) {
            Post post = posts.next();
            Log.i("MyAmplifyApp", "Post: " +  post);
        }
    },
    failure -> Log.e("MyAmplifyApp", "Query failed.", failure)
);
```

</amplify-block>
<amplify-block name="Kotlin">

```kotlin
Amplify.DataStore
    .query(Post::class,
        Where.matches(Post.RATING.gt(4)
            .or(Post.STATUS.eq(PostStatus.PUBLISHED)))
    )
    .catch { Log.e("MyAmplifyApp", "Query failed", it) }
    .collect { Log.i("MyAmplifyApp", "Post: $it") }
```

</amplify-block>
<amplify-block name="RxJava">

```java
RxAmplify.DataStore.query(
    Post.class,
    Where.matches(Post.RATING.gt(4).or(Post.STATUS.eq(PostStatus.PUBLISHED))))
    .subscribe(
        post -> Log.i("MyAmplifyApp", "Post: " +  post),
        failure -> Log.e("MyAmplifyApp", "Query failed.", failure)
    );
```

</amplify-block>
</amplify-block-switcher>
