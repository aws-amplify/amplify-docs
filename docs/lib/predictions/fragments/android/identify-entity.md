## Set up your backend

If you haven't already done so, run `amplify init` inside your project and then `amplify add auth` (we recommend selecting the *default configuration*).

Run `amplify add predictions`, then use the following answers:

```console
? Please select from one of the categories below (Use arrow keys)
❯ Identify
  Convert
  Interpret
  Infer
  Learn More

? What would you like to identify? (Use arrow keys)
  Identify Text
❯ Identify Entities
  Identify Labels

? Provide a friendly name for your resource
  <Enter a friendly name here>

? Would you like use the default configuration? (Use arrow keys)
❯ Default Configuration
  Advanced Configuration

? Who should have access? (Use arrow keys)
  Auth users only
❯ Auth and Guest users
```
Run `amplify push` to create the resources in the cloud.

## Working with the API

### Detect entities in an image

To detect general entities like facial features, landmarks etc, default configuration from CLI workflow will suffice (i.e. celebrity detection enabled & entity identification from collection disabled).

Amplify will now detect general entity features when `IdentifyActionType.DETECT_ENTITIES` is passed in. Results are mapped to `IdentifyEntitiesResult`. For example:

```java
public void detectEntities(Bitmap image) {
    Amplify.Predictions.identify(
            IdentifyActionType.DETECT_ENTITIES,
            image,
            result -> {
                IdentifyEntitiesResult identifyResult = (IdentifyEntitiesResult) result;
                EntityDetails metadata = identifyResult.getEntities().get(0);
                Log.i("AmplifyQuickstart", metadata.getBox().toShortString());
            },
            error -> Log.e("AmplifyQuickstart", error.toString(), error)
    );
}
```

As a result of passing in an image, the bounding box ([`android.graphics.RectF`](https://developer.android.com/reference/android/graphics/RectF)) that captures detected entity will be printed to the console.

### Detect pre-determined entities in an image

You can also match entities from a pre-created [Amazon Rekognition Collection](https://docs.aws.amazon.com/rekognition/latest/dg/collections.html) in Amplify. To access this feature, you must used advanced configuration in Amplify CLI:

Run `amplify add predictions`, then use the following answers:

```console
? Please select from one of the categories below (Use arrow keys)
❯ Identify
  Convert
  Interpret
  Infer
  Learn More

? What would you like to identify? (Use arrow keys)
  Identify Text
❯ Identify Entities
  Identify Labels

? Provide a friendly name for your resource
  <Enter a friendly name here>

? Would you like use the default configuration? (Use arrow keys)
  Default Configuration
❯ Advanced Configuration

? Would you like to enable celebrity detection? (Y/n)
  <Enter 'y'>

? Would you like to identify entities from a collection of images? (y/N)
  <Enter 'y'>

? How many entities would you like to identify? (50)
  10

? Would you like to allow users to add images to this collection? (Use arrow keys)
❯ Yes
  No

? Who should have access? (Use arrow keys)
  Auth users only
❯ Auth and Guest users
```
Run `amplify push` to create the resources in the cloud

**Note**: If entity detection was already configured, run `amplify update predictions` to reconfigure as necessary.

The value of `collectionId` is the name of your collection, which can be created directly via CLI. The value of `maxEntities` must be a number greater than `0` or less than `51` (50 is the max number of entities Rekognition can detect from a collection). If either value of `collectionId` or `maxEntities` is invalid, then `identify` will just detect entities in general with facial features, landmarks, etc.

If both `collectionId` and `maxEntities` are properly configured, then Amplify will detect entity matches from the Rekogition Collection in your app. Results are mapped to `IdentifyEntityMatchesResult`. For example:

```java
public void detectEntities(Bitmap image) {
    Amplify.Predictions.identify(
            IdentifyActionType.DETECT_ENTITIES,
            image,
            result -> {
                IdentifyEntityMatchesResult identifyResult = (IdentifyEntityMatchesResult) result;
                EntityMatch match = identifyResult.getEntityMatches().get(0);
                Log.i("AmplifyQuickstart", match.getExternalImageId());
            },
            error -> Log.e("AmplifyQuickstart", error.toString(), error)
    );
}
```
