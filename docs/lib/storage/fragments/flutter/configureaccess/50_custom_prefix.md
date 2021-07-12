You can customize your key path by defining custom prefix resolution for your requests. 

If you would like to define no prefix resolution logic, such as perform S3 requests at the root of the bucket, use `AWSS3PluginOptions.passThroughKeyResolver`.

```dart
AWSS3PluginOptions pluginOptions = AWSS3PluginOptions(customKeyResolver: AWSS3PluginOptions.passThroughKeyResolver);
S3UploadFileOptions options = S3UploadFileOptions(
    pluginOptions: pluginOptions);

try {
  UploadFileResult result = await Amplify.Storage.uploadFile(
    key: key,
    local: local,
    options: options
  );
} on StorageException catch (e) {
  print(e.message);
}
```

If you would like to define custom prefixes for each level, the following shows an example of retrieving the Cognito Identity Id and appending it to the prefix for the `private` access level.

```swift
// TODO: this is Swift
struct CustomOverridePrefixResolver: AWSS3PluginCustomPrefixResolver {
    func resolvePrefix(for accessLevel: StorageAccessLevel,
                        targetIdentityId: String?) -> Result<String, StorageError> {
        switch accessLevel {
        case .guest:
            return .success("myPublicPrefix/")
        case .protected:
            return .success("myProtectedPrefix/")
        case .private:
            guard targetIdentityId == nil else {
                return .success("myPrivatePrefix/" + targetIdentityId! + "/")
            }
            let result = getIdentityId()
            switch result {
            case .success(let identityId):
                return .success("myPrivatePrefix/" + identityId + "/")
            case .failure(let error):
                return .failure(StorageError.invalid("Could not retrieve identityId"))
            }
        }
    }

    func getIdentityId() -> Result<String, AuthError> {
        var result: Result<String, AuthError>?
        let semaphore = DispatchSemaphore(value: 0)
        _ = Amplify.Auth.fetchAuthSession { event in
            defer {
                semaphore.signal()
            }

            switch event {
            case .success(let session):
                result = (session as? AuthCognitoIdentityProvider)?.getIdentityId()
            case .failure(let error):
                result = .failure(error)

            }
        }
        semaphore.wait()
        guard let validResult = result else {
            return .failure(AuthError.unknown("""
            Did not receive a valid response from fetchAuthSession for identityId.
            """))
        }
        return validResult
    }
}
```

Register the `CustomOverridePrefixResolver` during configuration of the plugin
```dart
AWSS3PluginOptions pluginOptions = AWSS3PluginOptions(customKeyResolver: CustomOverrideKeyResolver());
S3UploadFileOptions options = S3UploadFileOptions(
    pluginOptions: pluginOptions);

try {
  UploadFileResult result = await Amplify.Storage.uploadFile(
    key: key,
    local: local,
    options: options
  );
} on StorageException catch (e) {
  print(e.message);
}
```

Alternatively, if you have multiple prefix resolution logic, you can pass in the `AWSS3PluginCustomPrefixResolver` instance in each storage request.

