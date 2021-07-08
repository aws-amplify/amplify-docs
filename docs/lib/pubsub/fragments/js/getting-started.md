The AWS Amplify PubSub category provides connectivity with cloud-based message-oriented middleware. You can use PubSub to pass messages between your app instances and your app's backend creating real-time interactive experiences.

PubSub is available with **AWS IoT** and **Generic MQTT Over WebSocket Providers**. 

<amplify-callout>
With AWS IoT, AWS Amplify's PubSub automatically signs your HTTP requests when sending your messages.
</amplify-callout>

## AWS IoT

When used with `AWSIoTProvider`, PubSub is capable of signing request according to [Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html). 

To use in your app, import `AWSIoTProvider`:

```javascript
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
```

Define your endpoint and region in your configuration:

```javascript
// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
     aws_pubsub_region: '<YOUR-IOT-REGION>',
     aws_pubsub_endpoint: 'wss://xxxxxxxxxxxxx.iot.<YOUR-IOT-REGION>.amazonaws.com/mqtt',
   }));
```

Find your `aws_pubsub_endpoint` by logging onto your **AWS Console**, choose **IoT Core** from the list of services, then choose *Settings* from the left navigation pane.

### Step 1: Create IAM policies for AWS IoT

To use PubSub with AWS IoT, you will need to create the necessary IAM policies in the AWS IoT Console, and attach them to your Amazon Cognito Identity. 

Go to IoT Core and choose *Secure* from the left navigation pane. Then navigate to *Create Policy*. The following `myIoTPolicy` policy will allow full access to all the topics.

![Alt text](~/images/create-iot-policy.png)


### Step 2: Attach your policy to your Amazon Cognito Identity

The next step is attaching the policy to your *Cognito Identity*. 

You can retrieve the `Cognito Identity Id` of a logged in user with Auth Module:
```javascript
    Auth.currentCredentials().then((info) => {
      const cognitoIdentityId = info.data.IdentityId;
    });
```

Then, you need to send your *Cognito Identity Id* to the AWS backend and attach `myIoTPolicy`. You can do this with the following [AWS CLI](https://aws.amazon.com/cli/) command:

```bash
aws iot attach-policy --policy-name 'myIoTPolicy' --target '<YOUR_COGNITO_IDENTITY_ID>'
```

### Step 3: Allow the Amazon Cognito Authenticated Role to access IoT Services

For your Cognito Authenticated Role to be able to interact with **AWS IoT** it may be necessary to update its permissions, if you haven't done this before.  
One way of doing this is to log to your **AWS Console**, select **CloudFormation** from the available services. Locate the parent stack of your solution: it is usually named `<SERVICE-NAME>-<CREATION_TIMESTAMP>`.  
Select the **Resources** tab and tap on `AuthRole` **Physical ID**.  
The IAM console will be opened in a new tab. Once there, tap on the button **Attach Policies**, then search `AWSIoTDataAccess` and `AWSIoTConfigAccess`, select them and tap on **Attach policy**.  
  
> Failing to grant IoT related permissions to the Cognito Authenticated Role will result in errors similar to the following in your browser console: `errorCode: 8, errorMessage: AMQJS0008I Socket closed.`

## Third Party MQTT Providers

Import PubSub module and related service provider plugin to your app:

```javascript
import { PubSub } from 'aws-amplify';
import { MqttOverWSProvider } from "@aws-amplify/pubsub/lib/Providers";
```

To configure your service provider with a service endpoint, add following code:
```javascript
// Apply plugin with configuration
Amplify.addPluggable(new MqttOverWSProvider({
    aws_pubsub_endpoint: 'wss://iot.eclipse.org:443/mqtt',
}));
```

You can integrate any MQTT Over WebSocket provider with your app. Click [here](https://docs.aws.amazon.com/iot/latest/developerguide/protocols.html#mqtt-ws) to learn more about MQTT Over WebSocket.
