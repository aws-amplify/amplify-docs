You can customize your key path by defining prefixes:

If you would like no prefix resolution logic, such as perform S3 requests at the root of the bucket:

```javascript
Storage.configure({
    customPrefix: {
        public: '',
    },
    // ...
})
```

If you would like to define custom prefixes for each level:

```javascript
Storage.configure({
    customPrefix: {
        public: 'myPublicPrefix/',
        protected: 'myProtectedPrefix/',
        private: 'myPrivatePrefix/'
    },
    // ...
})
```

If you have multiple prefixes associated with the same access level, you can change the prefix when performing the storage operation:

```javascript
Storage.put(photoKey, file, {
    customPrefix: {
        public: "myPublicPrefix/",
        protected: 'myProtectedPrefix/',
        private: 'myPrivatePrefix/'
    },
    // ...
});
```

The library will automatically construct the `/{user_identity_id}` in the request for `protected` and `private` access levels. If you do not require the Cognito Identity ID appended to the prefix, use `customPrefixResolver` to control whether the ID is added or not. The following example does not add the identityId for the `protected` level, and adds it for the `private` level.

```javascript
Storage.configure({
    customPrefixResolver: { (context) => 
        if (context.level == "public") {
            return "myPublicPrefix/"
        } else if (context.level == "protected") {
            return "myProtectedPrefix/"
        } else if (context.level == "private") {
            if (context.identityId != null) {
                return "myPrivatePrefix/" + context.identityId + "/"
            } else {
                Auth.currentCredentials().then(credentials => 
                    return "myPrivatePrefix/" + credentials.identityId + "/"
                )
            }
        }
    },
    // ...
})
```