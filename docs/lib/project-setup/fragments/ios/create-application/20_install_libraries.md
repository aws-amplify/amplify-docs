<amplify-block-switcher>

<amplify-block name="Swift Package Manager">

To start adding the Amplify Libraries to your iOS project, open your project in Xcode and select **File > Swift Packages > Add Package Dependency**.

![Add package dependency](~/images/project-setup/20_4_add-package-dependency.png)

Enter the Amplify iOS GitHub repo URL (`https://github.com/aws-amplify/amplify-ios`) into the search bar and click **Next**.

![Search for repo](~/images/project-setup/spm-setup-03-dependency-version-options.png)

You'll see the Amplify iOS repository rules for which version of Amplify you want Swift Package Manager to install. Choose the first rule, **Version**, and select Up to Next Minor as it will use the latest compatible version of the dependency that can be detected from the `main` branch, then click **Next**.

![Dependency version options](~/images/project-setup/20_6_dependency-version-options.png)

NOTE: The AWS Mobile SDK for iOS does not use Semantic Versioning, and may introduce breaking API changes on minor version releases. We recommend setting your Version rule to Up to Next Minor and evaluating minor version releases to ensure they are compatible with your app.

Lastly, choose which of the libraries you want added to your project. Always select the **Amplify** library. The "Plugin" to install depends on which categories you are using:

- API: **AWSAPIPlugin**
- Analytics: **AWSPinpointAnalyticsPlugin**
- Auth: **AWSCognitoAuthPlugin**
- DataStore: **AWSDataStorePlugin**
- Storage: **AWSS3StoragePlugin**

  _Note: AWSPredictionsPlugin is not currently supported through Swift Package Manager due to different minimum iOS version requirements. Support for this will eventually be added._

![Select dependencies](~/images/project-setup/20_7_select-dependencies.png)

Select all that are appropriate, then click **Finish**.

You can always go back and modify which SPM packages are included in your project by opening the Swift Packages tab for your project: Click on the Project file in the Xcode navigator, then click on your project's icon, then select the **Swift Packages** tab.

<amplify-callout>

You must explicitly import plugins in your app code when using Swift Package Manager to install Amplify, as in:

```swift
import Amplify
import AWSAPIPlugin
import AWSDataStorePlugin
```

This is a result of Swift Package Manager's importing only relevant pieces of the dependency being installed–in this case, the categories of Amplify.

</amplify-callout>

</amplify-block>

<amplify-block name="CocoaPods">

Before starting this step, please make sure you **close Xcode.**

**Open a terminal** and **change directories to your project**.  For example, if you created your project in the folder `~/Developer`, you can:
```bash
cd ~/Developer/MyAmplifyApp
```

In order to initialize your project with the CocoaPods package manager, **execute the command**:
```bash
pod init
```

After doing this, you should see a newly created file called `Podfile`.  This file is used to describe what packages your project depends on.

**Update the file** to include the `Amplify` pod:
```
target 'MyAmplifyApp' do
  use_frameworks!
  pod 'Amplify'
end
```

To download and install the Amplify pod into your project, **execute the command**:
```bash
pod install --repo-update
```

After doing this, you should now see file called `MyAmplifyApp.xcworkspace`.  You are required to use this file from now on instead of the .xcodeproj file.  To open your workspace, **execute the command**:
```bash
xed .
```
This should open the newly generated MyAmplifyApp.xcworkspace in Xcode.

</amplify-block>

</amplify-block-switcher>
