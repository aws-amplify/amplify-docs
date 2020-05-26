The following APIs will allow you to identify text (words, tables, pages from a book) from an image.

## Set up your backend

Run `amplify add predictions`, then use the following answers:

```console
? Please select from one of the categories below (Use arrow keys)
  `Identify`
? What would you like to identify? (Use arrow keys)
  `Identify Text`
? Provide a friendly name for your resource
  `identifyText`
? Would you also like to identify documents? (y/N)
  `Y`
? Who should have access? (Use arrow keys)
  `Auth and Guest users`
```

## Working with the API

### Detect text in an image

Amplify will make calls to both Amazon Textract and Amazon Rekognition depending on the type of text you are looking to identify (i.e. image or document).

Passing in `TextFormatType.PLAIN` as the identify action will yield `IdentifyResult`, which must be cast into `IdentifyTextResult`. See below for an example of plain text detection from an image.

<amplify-block-switcher>
<amplify-block name="Java">

```java
public void detectText(Bitmap image) {
    Amplify.Predictions.identify(
            TextFormatType.PLAIN,
            image,
            result -> {
                IdentifyTextResult identifyResult = (IdentifyTextResult) result;
                Log.i("MyAmplifyApp", identifyResult.getFullText())
            },
            error -> Log.e("MyAmplifyApp", "Identify text failed", error)
    );
}
```

</amplify-block>
<amplify-block name="Kotlin">

```kotlin
fun detectText(image: Bitmap) {
    Amplify.Predictions.identify(
        TextFormatType.PLAIN,
        image,
        Consumer { result: IdentifyResult? ->
            val identifyResult = result as IdentifyTextResult
            Log.i("MyAmplifyApp", identifyResult.getFullText())
        },
        Consumer { error: PredictionsException? ->
            Log.e("MyAmplifyApp", "Identify text failed, error)
        }
    )
}
```


</amplify-block>
</amplify-block-switcher>


### Detect text in a document

Passing in any other format of `TextFormatType` (i.e. `FORM`, `TABLE` or `ALL`) will yield `IdentifyResult`, which must be cast into `IdentifyDocumentTextResult`. See below for an example with `TextFormatType.FORM` for detecting forms from a document.


<amplify-block-switcher>
<amplify-block name="Java">

```java
public void detectText(Bitmap image) {
    Amplify.Predictions.identify(
            TextFormatType.FORM,
            image,
            result -> {
                IdentifyDocumentTextResult identifyResult = (IdentifyDocumentTextResult) result;
                Log.i("MyAmplifyApp", identifyResult.getFullText())
            },
            error -> Log.e("MyAmplifyApp", "Identify failed", error)
    );
}
```

</amplify-block>
<amplify-block name="Kotlin">

```kotlin
fun detectText(image: Bitmap) {
    Amplify.Predictions.identify(
        TextFormatType.FORM,
        image,
        Consumer { result: IdentifyResult? ->
            val identifyResult = result as IdentifyDocumentTextResult
            Log.i("MyAmplifyApp", identifyResult.getFullText())
        },
        Consumer { error: PredictionsException? ->
            Log.e("MyAmplifyApp", "Identify failed", error)
        }
    )
}
```

</amplify-block>
</amplify-block-switcher>
