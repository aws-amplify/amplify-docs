Enable your app to store and retrieve user files from cloud storage with the permissions model that suits your purpose. The CLI deploys and configures cloud storage buckets using [Amazon Simple Storage Service](http://docs.aws.amazon.com/AmazonS3/latest/dev/).

**_Note_**

This guide specifically uses `TransferUtility`, which is a high-level wrapper over `AmazonS3Client`. [`TransferUtility`](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/mobileconnectors/s3/transferutility/TransferUtility.html) is a tool that simplifies asynchronous _transfer_ management (i.e. upload and download), and it may not contain all of the features available in Amazon S3 service. To access low-level features such as bucket manipulation and object deletion, please refer to the documentation for [`AmazonS3Client`](https://aws-amplify.github.io/aws-sdk-android/docs/reference/com/amazonaws/services/s3/AmazonS3Client.html).

## Storage Access

The CLI configures three different access levels on the storage bucket: public, protected and private. When you run `amplify add storage`, the CLI will configure appropriate IAM policies on the bucket using a Cognito Identity Pool Role. You will have the option of adding CRUD (Create/Update, Read and Delete) based permissions as well, so that Authenticated and Guest users will be granted limited permissions within these levels.

If you had previously enabled user sign-in by running `amplify add auth` in your project, the policies will be connected to an `Authenticated Role` of the Identity Pool which has scoped permission to the objects in the bucket for each user identity. If you haven't configured user sign-in, then an `Unauthenticated Role` will be assigned for each unique user/device combination, which still has scoped permissions to just their objects.

* Public: Accessible by all users of your app. Files are stored under the `public/` path in your S3 bucket.
* Protected: Readable by all users, but writable only by the creating user. Files are stored under `protected/{user_identity_id}/` where the `user_identity_id` corresponds to the unique Amazon Cognito Identity ID for that user.
* Private: Only accessible for the individual user. Files are stored under `private/{user_identity_id}/` where the `user_identity_id` corresponds to the unique Amazon Cognito Identity ID for that user.

See [Authentication](./authentication) for more information on how to get the `user_identity_id` for a signed in user.
## Set Up Your Backend

1. Complete the [Get Started](start) steps before you proceed.

2. Use the CLI to add storage to your cloud-enabled backend and app.

    In a terminal window, navigate to your project folder (the folder that typically contains your project level build.gradle), and add the SDK to your app.

    ```bash
    $ cd ./YOUR_PROJECT_FOLDER
    $ amplify add storage
    ```
3. Choose `Content` as your storage service.

    `❯ Content (Images, audio, video, etc.)`

4. The combination of friendly name and bucket name must be globally unique. If another S3 user has specified the same values for both of these as you, the amplify push step below will fail.

5. The CLI walks you through the options to enable Auth (if not enabled previously), to name your S3 bucket, and to decide who should have access (select `Auth and guest users` and toggle all to select `create/update, read, and delete` access for both auth and guest users).

6. Confirm that you have Storage and Auth set up.

    ```bash
      $ amplify status
      | Category  | Resource name   | Operation | Provider plugin   |
      | --------- | --------------- | --------- | ----------------- |
      | Auth      | cognito2e202b09 | Create    | awscloudformation |
      | Storage   | sabc0123de      | Create    | awscloudformation |
      ```
7. To create your backend run:

    ```bash
    $ amplify push
    ```

    The CLI will create the awsconfiguration.json file in your project's `res/raw` directory.

### Lambda Triggers
If you want to enable triggers for the storage category with Amazon S3 & Amazon DynamoDB as providers, the CLI supports associating Lambda triggers with S3 and DynamoDB events. For example, this can be useful for a use case where you want to invoke a Lambda function after a create or update operation on a DynamoDB table managed by the Amplify CLI. [Read More]({%if jekyll.environment == 'production'%}{{site.amplify.docs_baseurl}}{%endif%}/cli-toolchain/quickstart#storage-examples)

## Connect to Your Backend

Use the following steps to connect add file storage backend services to your app.

1. Add the following to `app/build.gradle` (Module:app):

	```groovy
	dependencies {
	  implementation 'com.amazonaws:aws-android-sdk-s3:2.15.+'
	  implementation ('com.amazonaws:aws-android-sdk-mobile-client:2.15.+@aar') { transitive = true }
	  implementation ('com.amazonaws:aws-android-sdk-auth-userpools:2.15.+@aar') { transitive = true }
	}
	```
	Perform a `Gradle Sync` to download the AWS Mobile SDK components into your app.

2. Add the following to `AndroidManifest.xml`:

	```xml
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
	<service android:name="com.amazonaws.mobileconnectors.s3.transferutility.TransferService" android:enabled="true" />
	```

3. **For Android Q (API 29)**: API 29 enforces scoped storage access for Android apps. To gain access to legacy external storage, enable the following application property inside `AndroidManifest.xml`:

	```xml
	<manifest ...>
	  <application android:requestLegacyExternalStorage="true" ...>
	    ...
	  </application>
	</manifest>
	```

## Mocking and Local Testing

Amplify supports running a local mock server for testing your application with S3. Please see the [CLI Toolchain documentation](/cli/usage/mock#storage-mocking-setup) for more details.

## Transfer Utility and AWS Cognito

If you expect your app to perform transfers that take longer than 50 minutes, use [AmazonS3Client](http://docs.aws.amazon.com/AWSAndroidSDK/latest/javadoc/com/amazonaws/services/s3/AmazonS3Client.html) instead of [TransferUtility](http://docs.aws.amazon.com/AWSAndroidSDK/latest/javadoc/com/amazonaws/mobileconnectors/s3/transferutility/TransferUtility.html).

## Additional Resources

* [Amazon Simple Storage Service Getting Started Guide](http://docs.aws.amazon.com/AmazonS3/latest/gsg/GetStartedWithS3.html)
* [Amazon Simple Storage Service API Reference](http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
* [Amazon Simple Storage Service Developer Guide](http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html)
* [Identity and Access Management Console](https://console.aws.amazon.com/iam/home)
* [Granting Access to an Amazon S3 Bucket](http://blogs.aws.amazon.com/security/post/Tx3VRSWZ6B3SHAV/Writing-IAM-Policies-How-to-grant-access-to-an-Amazon-S3-bucket)
* [Protecting data using customer provided encryption keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html)

## Sample app

For a sample app that demonstrates the TransferUtility capabilities, see [S3 TransferUtility Sample](https://github.com/awslabs/aws-sdk-android-samples/tree/master/S3TransferUtilitySample).