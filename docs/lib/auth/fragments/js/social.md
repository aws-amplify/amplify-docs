## OAuth and Federation Overview

[OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) is the common Authorization framework used by web and mobile applications for getting access to user information ("scopes") in a limited manner. Common analogies you will hear in OAuth is that of boarding a plane or staying in a hotel - showing your identification is the Authentication piece (signing into an app) and using the boarding pass/hotel key is what you are Authorized to access.

OAuth support in Amplify uses Cognito User Pools and supports federation with social providers, which will automatically create a corresponding user in the User Pool after a login. [OIDC](https://en.wikipedia.org/wiki/OpenID_Connect) tokens are available in the app after the application has completed this process.

<inline-fragment src="~/lib/auth/fragments/common/social_signin_web_ui/setup_auth_provider.md"></inline-fragment>

## Configure Auth Category

Once you have the social provider configured, run the following in your project’s root folder:

```bash
amplify add auth     ## "amplify update auth" if already configured
```

Select Default configuration with Social Provider (Federation):

```console
Do you want to use the default authentication and security configuration? 
  Default configuration 
❯ Default configuration with Social Provider (Federation) 
  Manual configuration 
  I want to learn more.
```

**Redirect URIs**

For *Sign in Redirect URI(s)* inputs, you can put one URI for local development and one for production. Example: `http://localhost:3000/` in dev and `https://www.example.com/` in production. The same is true for *Sign out redirect URI(s)*.

**Note:** if you have multiple redirect URI inputs, you'll need to handle both of them where you configure your Amplify project. For example:

```javascript
import awsConfig from './aws-exports';

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  }
}

Amplify.configure(updatedAwsConfig);
```

**React Native - Redirect URIs**

For React Native applications, you need to define a custom URL scheme for your application before testing locally or publishing to the app store. This is different for Expo or vanilla React Native. For Expo, follow the steps in [Expo Linking Guide](https://docs.expo.io/guides/linking/). For vanilla React Native, follow the steps in [React Native Linking Guide](https://reactnative.dev/docs/linking). After completing those steps, assuming you are using `myapp` as the name of your URL Scheme (or whatever friendly name you have chosen), you will use these URLs as *Sign in Redirect URI(s)* and/or *Sign out redirect URI(s)* inputs. Your URIs could look like any of these:

- `myapp://`
- `exp://127.0.0.1:19000/--/` (Local development if your app is running [in the Expo client](https://docs.expo.io/versions/latest/workflow/linking/#linking-to-your-app)).

*React Native - iOS - Info.plist*

```xml

 <plist version="1.0">

     <dict>
     <!-- YOUR OTHER PLIST ENTRIES HERE -->

     <!-- ADD AN ENTRY TO CFBundleURLTypes for Cognito Auth -->
     <!-- IF YOU DO NOT HAVE CFBundleURLTypes, YOU CAN COPY THE WHOLE BLOCK BELOW -->
     <key>CFBundleURLTypes</key>
     <array>
         <dict>
             <key>CFBundleURLSchemes</key>
             <array>
                 <string>myapp</string>
             </array>
         </dict>
     </array>

     <!-- ... -->
     </dict>
```

*React Native - Android - AndroidManifest.xml*

- Set the `launchMode` of MainActivity to `singleTask`
- Add new intent filter (below) with `scheme="myapp"`

```xml
<application>
  <activity
    android:name=".MainActivity"
    android:launchMode="singleInstance">

    <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:scheme="myapp" />
    </intent-filter>

  </activity>
</application>
```

<inline-fragment src="~/lib/auth/fragments/common/social_signin_web_ui/configure_auth_category.md"></inline-fragment>

### Known Limitations
When using the federated OAuth flow with Cognito User Pools, the [device tracking and remembering](https://aws.amazon.com/blogs/mobile/tracking-and-remembering-devices-using-amazon-cognito-your-user-pools/) features are currently not available within the library. If you are looking for this feature within the library, please open a feature request [here](https://github.com/aws-amplify/amplify-js/issues/new?assignees=&labels=feature-request&template=feature_request.md&title=) and provide upvotes in order for us to take this into consideration for the future of the library.

## Setup frontend

After configuring the OAuth endpoints, you can use them or the Hosted UI with `Auth.federatedSignIn()`. Passing `LoginWithAmazon`, `Facebook`, `Google`, or `SignInWithApple` will bypass the Hosted UI and federate immediately with the social provider as shown in the below React example. If you are looking to add a custom state, you are able to do so by passing a string (e.g. `Auth.federatedSignIn({ customState: 'xyz' })`) value and listening for the custom state via Hub.

```javascript
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}>Open Facebook</button>
        <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
        <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
        <button onClick={() => Auth.signOut()}>Sign Out {user.getUsername()}</button>
      </div>
    );
  }
}
```

### Deploying to Amplify Console

To deploy your app to Amplify Console with continuous deployment of the frontend and backend, please follow [these instructions](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html#creating-a-new-backend-environment-with-authentication-parameters).

### Full Samples

<amplify-block-switcher>

<amplify-block name="React">

```js
import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <div>
      <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => Auth.federatedSignIn()}>Federated Sign In</button>
      )}
    </div>
  );
}

export default App;
```
</amplify-block>

<amplify-block name="React Native">

<amplify-callout>

**Note for iOS Apps**

In order for Amplify to listen for data from Cognito when linking back to your app, you will need to setup the `Linking` module in `AppDelegate.m` (see [React Native docs](https://reactnative.dev/docs/linking#enabling-deep-links) for more information):

```objectivec
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```
</amplify-callout>

**In-App Browser Setup (optional, but recommended)**

By default, Amplify will opened the Cognito Hosted UI in Safari/Chrome, but you can override that behavior by providing a custom `urlOpener`. The sample below uses [react-native-inappbrowser-reborn](https://github.com/proyecto26/react-native-inappbrowser), but you can use any other in-app browser available.

**Sample**

```js
import React, { useEffect, useState } from 'react';
import { Button, Linking, Text, View } from 'react-native';
import Amplify, { Auth, Hub } from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import awsconfig from './aws-exports';

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const { type, url: newUrl } = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
    Linking.openURL(newUrl);
  }
}

Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    urlOpener,
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <View>
      <Text>User: {user ? JSON.stringify(user.attributes) : 'None'}</Text>
      {user ? (
        <Button title="Sign Out" onPress={() => Auth.signOut()} />
      ) : (
        <Button title="Federated Sign In" onPress={() => Auth.federatedSignIn()} />
      )}
    </View>
  );
}

export default App;
```

<inline-fragment src="~/lib/auth/fragments/js/react-native-withoauth.md"></inline-fragment>

</amplify-block>

<amplify-block name="Expo">

**In-App Browser Setup (optional, but recommended)**

By default, Amplify will opened the Cognito Hosted UI in Safari/Chrome, but you can override that behavior by providing a custom `urlOpener`. The sample below uses Expo's [WebBrowser.openAuthSessionAsync](https://docs.expo.io/versions/v37.0.0/sdk/webbrowser/).

**Sample**

```js
import React, { useEffect, useState } from 'react';
import { Button, Linking, Platform, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

async function urlOpener(url, redirectUrl) {
	const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
		url,
		redirectUrl
	);

	if (type === 'success' && Platform.OS === 'ios') {
		WebBrowser.dismissBrowser();
		return Linking.openURL(newUrl);
	}
}

Amplify.configure({
	...awsconfig,
	oauth: {
		...awsconfig.oauth,
		urlOpener,
	},
});

function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		Hub.listen('auth', ({ payload: { event, data } }) => {
			switch (event) {
				case 'signIn':
					getUser().then((userData) => setUser(userData));
					break;
				case 'signOut':
					setUser(null);
					break;
				case 'signIn_failure':
				case 'cognitoHostedUI_failure':
					console.log('Sign in failure', data);
					break;
			}
		});

		getUser().then((userData) => setUser(userData));
	}, []);

	function getUser() {
		return Auth.currentAuthenticatedUser()
			.then((userData) => userData)
			.catch(() => console.log('Not signed in'));
	}

	return (
		<View>
			<Text>User: {user ? JSON.stringify(user.attributes) : 'None'}</Text>
			{user ? (
				<Button title="Sign Out" onPress={() => Auth.signOut()} />
			) : (
				<Button title="Federated Sign In" onPress={() => Auth.federatedSignIn()} />
			)}
		</View>
	);
}

export default App;

```

<inline-fragment src="~/lib/auth/fragments/js/react-native-withoauth.md"></inline-fragment>

</amplify-block>

</amplify-block-switcher>
