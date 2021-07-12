The following example checks if the user is in the cognito group that you specify (`Editors`), and resolves the prefix corresponding to path (`editorGroup/`) defined in the IAM policy.

```javascript
Storage.configure({
    customPrefixResolver: { (context) => 
        if (context.level == "public") {
            return "myPublicPrefix/"
        } else if (context.level == "protected") {
            const user =  await Auth.currentAuthenticatedUser();
            const groups = user.signInUserSession.accessToken.payload["cognito:groups"]
            if (groups.contains("Editors")) {
                return "editorGroup/" 
            } else {
                throw new StorageError("User not in group to perform storage operations against `protected` level")
            }
            
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