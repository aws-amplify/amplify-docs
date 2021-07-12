Storage module can manage files with three different access levels; `public`, `protected` and `private`. The Amplify CLI configures three different access levels on the storage bucket: public, protected and private. When you run `amplify add storage`, the CLI will configure appropriate IAM policies on the bucket using a Cognito Identity Pool Role. You will have the option of adding CRUD (Create/Update, Read and Delete) based permissions as well, so that Authenticated and Guest users will be granted limited permissions within these levels.

If you had previously enabled user sign-in by running `amplify add auth` in your project, the policies will be connected to an `Authenticated Role` of the Identity Pool which has scoped permission to the objects in the bucket for each user identity. If you haven't configured user sign-in, then an `Unauthenticated Role` will be assigned for each unique user/device combination, which still has scoped permissions to just their objects.

* Public: Accessible by all users of your app. Files are stored under the `public/` path in your S3 bucket.
* Protected: Readable by all users, but writable only by the creating user. Files are stored under `protected/{user_identity_id}/` where the `user_identity_id` corresponds to the unique Amazon Cognito Identity ID for that user.
* Private: Only accessible for the individual user. Files are stored under `private/{user_identity_id}/` where the `user_identity_id` corresponds to the unique Amazon Cognito Identity ID for that user.

When using Auth and Storage modules together, you do not need to construct the `/{user_identity_id}/` manually as the library will use the configured Cognito Identity ID for your user/device along with the configured access level for an action. This includes UnAuthenticated access where you will first call `Auth.currentCredentials()` before a Storage action. See [Authentication](~/lib/auth/overview.md) for more information.

The access level can be configured on the Storage object globally. Alternatively, the access levels can be set in individual function calls.

> Default access level for Storage module is `public`. Unless you configure Storage otherwise, all uploaded files will be publicly available for all users.


Access level configuration on the Storage object:

```javascript
Storage.configure({ level: 'private' });
Storage.get('welcome.png'); // Gets the welcome.png belonging to current user
```

Configuration when calling the API:

```javascript
Storage.get('welcome.png', { level: 'public' }); // Gets welcome.png in public space
```

The default access level is `public`:
```javascript
Storage.get('welcome.png'); // Get welcome.png in public space
```

There is also a shortcut `vault`, which is merely a Storage instance with `private` level set:

```javascript
Storage.vault.get('welcome.png'); // Get the welcome.png belonging to current user
```

<inline-fragment platform="js" src="~/lib/storage/fragments/native_common/configureaccess/customization.md"></inline-fragment>