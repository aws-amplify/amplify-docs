The primary use case for remembering a device that user signed in with is reducing friction when using Multi-Factor Authentication (MFA).  If MFA is enabled for an Amazon Cognito user pool, end users have to type in a security code received by E-mail or SMS each time they want to sign in.  This increases security but comes at the expense of user experience.

Remembering a device that user logged in with acts as a second factor of authentication, thereby reducing friction in the user experience.

## Prerequisites
* An iOS application targeting at least iOS 11.0
* Integrated with Amplify Auth and ability to sign in with an account
  * For a full example, see: [Auth Getting Started](~/lib/auth/getting-started.md)

## Configure the Backend
To enable "Remember a device" open the Cognito User Pool console.  To do this, **go to your project directory** and **issue the command**:
```bash
amplify auth console
```

**Select the following option** to open the Cognito User Pool console:
```bash
? Which Console
    User Pool
```

When the console opens, **click on Devices** from the left navigation menu, which will render the following page allowing you to configure your preference for remembering a user's device.

![auth](~/images/auth/webconsole_remember1.png)

To enable remember a device, **choose either Always or User Opt in** depending on whether you always want to remember a user's device or give the user the ability to choose.

If MFA is enabled for the cognito user pool, you will have the option to suppress the second factor during multi-factor authentication.  **Choose** Yes if you want a remembered device to be used as a second factor mechanism or No otherwise.

![auth](~/images/auth/webconsole_remember2.png)

When you have made your selection(s), click "Save changes".  You are now ready to start updating your code to manage your remembered devices.

## APIs
### Remember Device
You can mark your device as remembered:
<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/device_features/10_rememberDevice.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/device_features/10_rememberDevice.md"></inline-fragment>

### Forget Device
You can forget your device by using the following API.  Note that forgetten devices are still tracked.  See below for the difference between remembered, forgotten and tracked.
<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/device_features/20_forgetDevice.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/device_features/20_forgetDevice.md"></inline-fragment>

### Fetch Devices
You can fetch a list of remembered devices by using the following:
<inline-fragment platform="ios" src="~/lib/auth/fragments/ios/device_features/30_fetchDevice.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/auth/fragments/android/device_features/30_fetchDevice.md"></inline-fragment>

## Terminology
* **Tracked**
  * Every time the user signs in with a new device, the client is given the device key at the end of a successful authentication event.  We use this device key to generate a salt and password verifier which is used to call the ConfirmDevice API.  At this point, the device is considered to be **tracked**.  Once the device is in a tracked state, you can use the Amazon Cognito console to see the time it started to be tracked, last authentication time, and other information about that device.
* **Remembered**
  * Remembered devices are also tracked. During user authentication, the device key and secret pair assigned to a remembered device is used to authenticate the device to verify that it is the same device that the user previously used to sign in.
* **Not Remembered**
  * A not-remembered device is a tracked device where Cognito has been configured to require users to "Opt-in" to remember a device, but the user has not opt-ed in to having the device remembered.  This use case is used for users signing into their application from a device that they don't own.
* **Forgotten**
  * In the event that you no longer want to remember or track a device, you can use the `Amplify.Auth.forgetDevice()` API to remove this device from being both remembered and tracked.