You can customize your key path by defining custom prefix resolution for your requests. 

If you would like no prefix resolution logic, such as perform S3 requests at the root of the bucket, use `.passThroughKeyResolver`.

```swift
// At configuration of the plugin
let storagePlugin = AWSS3StoragePlugin(configuration: .passThroughPrefixResolver)
Amplify.add(storagePlugin)

// Or when performing the storage operation
let uploadOptions = StorageUploadDataRequest.Options(pluginOptions: AWSS3PluginOptions.passThroughKeyResolver)
Amplify.Storage.uploadData(key: key, data: data, options: uploadOptions) 
```

If you would like to define custom prefixes for each level, the following shows an example of retrieving the Cognito Identity Id and appending it to the prefix for the `private` access level.

```swift
import Amplify
import AmplifyPlugins

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
```swift
let storagePlugin = AWSS3StoragePlugin(configuration: .customPrefixResolver(CustomOverridePrefixResolver()))
Amplify.add(storagePlugin)
```

Alternatively, if you have multiple prefix resolution logic, you can pass in the `AWSS3PluginCustomPrefixResolver` instance in each storage request.
```swift
let pluginOptions = AWSS3PluginOptions(customKeyResolver: CustomOverrideKeyResolver())        
let uploadOptions = StorageUploadDataRequest.Options(pluginOptions: pluginOptions)
Amplify.Storage.uploadData(key: key, data: data, options: uploadOptions) 
```


