# Setup Options for the SDK

The AWS SDK contains [high level client interfaces](./start) for quickly adding common features and functionality to your app. You can also manually add the generated AWS service interfaces for direct interaction if you have custom or advanced requirements.

## Android Gradle setup

The AWS Mobile SDK for Android is available through Gradle.

If you are using Android Studio, add the dependency for the individual services that your project will use to your `app/build.gradle` file, as shown below.

```groovy
dependencies {
    implementation 'com.amazonaws:aws-android-sdk-ddb:2.11.+'
}
```

A full list of dependencies are listed below. For dependencies ending in "`@aar`" use a compile statement in the following form.

```groovy
implementation ('com.amazonaws:aws-android-sdk-mobile-client:2.11.+@aar') { transitive = true }
```

Dependency | Build.gradle Value
------------ | -------------
"Amazon API Gateway" | "com.amazonaws:aws-android-sdk-apigateway-core:2.11.+"
"AWS Auth Core" | "com.amazonaws:aws-android-sdk-auth-core:2.11.+@aar"
"AWS Facebook SignIn Provider" | "com.amazonaws:aws-android-sdk-auth-facebook:2.11.+@aar"
"AWS Google SignIn Provider" | "com.amazonaws:aws-android-sdk-auth-google:2.11.+@aar"
"AWS Auth UI" | "com.amazonaws:aws-android-sdk-auth-ui:2.11.+@aar"
"AWS Cognito User Pools SignIn Provider" | "com.amazonaws:aws-android-sdk-auth-userpools:2.11.+@aar"
"Amazon Auto Scaling" | "com.amazonaws:aws-android-sdk-autoscaling:2.11.+"
"Amazon CloudWatch" | "com.amazonaws:aws-android-sdk-cloudwatch:2.11.+"
"Amazon Cognito Auth" | "com.amazonaws:aws-android-sdk-cognitoauth:2.11.+@aar"
"Amazon Cognito Identity Provider" | "com.amazonaws:aws-android-sdk-cognitoidentityprovider:2.11.+"
"AWS Core" | "com.amazonaws:aws-android-sdk-core:2.11.+"
"Amazon DynamoDB Document Model" | "com.amazonaws:aws-android-sdk-ddb-document:2.11.+"
"Amazon DynamoDB Object Mapper" | "com.amazonaws:aws-android-sdk-ddb-mapper:2.11.+"
"Amazon DynamoDB" | "com.amazonaws:aws-android-sdk-ddb:2.11.+"
"Amazon Elastic Compute Cloud" | "com.amazonaws:aws-android-sdk-ec2:2.11.+"
"Amazon Elastic Load Balancing" | "com.amazonaws:aws-android-sdk-elb:2.11.+"
"AWS IoT" | "com.amazonaws:aws-android-sdk-iot:2.11.+"
"Amazon Kinesis" | "com.amazonaws:aws-android-sdk-kinesis:2.11.+"
"Amazon Kinesis Video" | "com.amazonaws:aws-android-sdk-kinesisvideo:2.11.+@aar"
"Amazon Key Management Service (KMS)" | "com.amazonaws:aws-android-sdk-kms:2.11.+"
"AWS Lambda" | "com.amazonaws:aws-android-sdk-lambda:2.11.+"
"Amazon Lex" | "com.amazonaws:aws-android-sdk-lex:2.11.+@aar"
"Amazon CloudWatch Logs" | "com.amazonaws:aws-android-sdk-logs:2.11.+"
"Amazon Machine Learning" | "com.amazonaws:aws-android-sdk-machinelearning:2.11.+"
"AWS Mobile Client" | "com.amazonaws:aws-android-sdk-mobile-client:2.11.+@aar"
"Amazon Pinpoint" | "com.amazonaws:aws-android-sdk-pinpoint:2.11.+"
"Amazon Polly" | "com.amazonaws:aws-android-sdk-polly:2.11.+"
"Amazon Rekognition" | "com.amazonaws:aws-android-sdk-rekognition:2.11.+"
"Amazon Simple Storage Service (S3)" | "com.amazonaws:aws-android-sdk-s3:2.11.+"
"Amazon Simple DB (SDB)" | "com.amazonaws:aws-android-sdk-sdb:2.11.+"
"Amazon SES" | "com.amazonaws:aws-android-sdk-ses:2.11.+"
"Amazon SNS" | "com.amazonaws:aws-android-sdk-sns:2.11.+"
"Amazon SQS" | "com.amazonaws:aws-android-sdk-sqs:2.11.+"

Whenever a new version of the SDK is released you can update by running a Gradle Sync and rebuilding your project to use the new features.

## Set Permissions in Your Manifest

Add the following permission to your `AndroidManifest.xml`::

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Direct AWS Service access

You can call AWS service interface objects directly via the generated SDK clients. You can use the client credentials provided by the [AWSMobileClient](./authentication) by calling `AWSMobileClient.getInstance()` and passing it to the service client. This will leverage short term AWS credentials from Cognito Identity. 

To work with service interface objects, your Amazon Cognito users' [IAM role](https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html) must have the appropriate permissions to call the requested services.
{: .callout .callout--warning}

For example, if you were using [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) in your Android project you would first add `aws-android-sdk-sqs:2.11.+` to your `app/build.gradle` and install the dependencies by running a Gradle Sync. 

Next, import `AmazonSQS` in your Android Studio project and create the client:

```java
import com.amazonaws.services.sqs.AmazonSQSAsyncClient;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.amazonaws.services.sqs.model.SendMessageResult;

public void addItemSQS() {
    AmazonSQSAsyncClient sqs = new AmazonSQSAsyncClient(AWSMobileClient.getInstance());
    sqs.setRegion(Region.getRegion("XX-XXXX-X"));
    SendMessageRequest req = new SendMessageRequest("https://sqs.XX-XXXX-X.amazonaws.com/XXXXXXXXXXXX/MyQueue", "hello world");
    sqs.sendMessageAsync(req, new AsyncHandler<SendMessageRequest, SendMessageResult>() {
        @Override
        public void onSuccess(SendMessageRequest request, SendMessageResult sendMessageResult) {
            Log.i(LOG_TAG, "SQS result: " + sendMessageResult.getMessageId());
        }

        @Override
        public void onError(Exception e) {
            Log.e(LOG_TAG, "SQS error: ", e);
        }
    });
}
```

You could then call `this.addItemSQS()` to invoke this action from your app.