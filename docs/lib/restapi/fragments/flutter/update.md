## PUT requests

To update an item via the API endpoint:

```dart
try {
    RestOptions options = RestOptions(
        path: "/todo/1",
        body: Uint8List.fromList("{\"name\":\"Mow the lawn\"}".codeUnits)
    );
    RestOperation restOperation = Amplify.API.put(
        restOptions: options
    );
    RestResponse response = await restOperation.response;
    print("PUT call succeeded");
    print(new String.fromCharCodes(response.data));
} catch(error) {
    print("PUT call failed: $error");
}
```
