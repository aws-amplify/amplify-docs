### Customize UI theme

For web frameworks, you can use CSS Variables as described [here](~/ui/customization/theming.md).

For React Native, you must override properties defined in AmplifyTheme.js [here](https://github.com/aws-amplify/amplify-js/blob/main/packages/aws-amplify-react-native/src/AmplifyTheme.ts)

```javascript
import { AmplifyTheme } from 'aws-amplify-react-native';

const MySectionHeader = Object.assign({}, AmplifyTheme.sectionHeader, { backgroundColor: 'orange' });
const MyTheme = Object.assign({}, AmplifyTheme, { sectionHeader: MySectionHeader });

<Authenticator theme={MyTheme} />
```

### Create your own UI

To customize the default auth experience even more, you can create your own auth UI. To do this, your component will leverage the following *Authenticator* properties:

```
- authState
- authData
- onStateChange
```

The following example creates an 'Always On' Auth UI, which continuously shows the current auth state in your app.

```javascript
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';

const AlwaysOn = (props) => {
    return (
        <div>
            <div>I am always here to show current auth state: {props.authState}</div>
            <button onClick={() => props.onStateChange('signUp')}>Show Sign Up</button>
        </div>
    )
}

handleAuthStateChange(state) {
    if (state === 'signedIn') {
        /* Do something when the user has signed-in */
    }
}

render() {
    return (
        <Authenticator hideDefault={true} onStateChange={this.handleAuthStateChange}>
            <SignIn/>
            <SignUp/>
            <ConfirmSignUp/>
            <Greetings/>
            <AlwaysOn/>
        </Authenticator>
    )
}
```

## Composing your own Authenticator

`Authenticator` is designed as a container for a number of Auth components. Each component does a single job, e.g., SignIn, SignUp, etc. By default, all of these elements are visible depending on the authentication state. 

If you want to replace some or all of the Authenticator elements, you need to set `hideDefault={true}`, so the component doesn't render its default view. Then you can pass in your own set of child components that listen to `authState` and decide what to do. 

You can also pass the child components you want to use. For example, the following Authenticator configuration only renders *Greetings* component which has a *Sign Out* button:

```javascript
<Authenticator hideDefault={true}>
    <Greetings />
</Authenticator>
```

### Customize greeting message

The *Greetings* component has two states: signedIn, and signedOut. To customize the greeting message, set properties `inGreeting` and `outGreeting` using a string or function.

```javascript
<Authenticator hideDefault={true}>
    <Greetings
        inGreeting={(username) => 'Hello ' + username}
        outGreeting="Please sign in..."
    />
</Authenticator>
```
### Customize Error Messages

During authentication flows, Amplify handles error messages returned from the server. Amplify provides a simple way of customizing those error messages with a `messageMap` callback.

The function takes the original message as arguments and then outputs the desired message. Check `AmplifyMessageMap.js` file to see how Amplify makes the map function.

```javascript
const map = (message) => {
    if (/incorrect.*username.*password/i.test(message)) {
        return 'Incorrect username or password';
    }

    return message;
}

<Authenticator errorMessage={map} />
```

You may notice in `AmplifyMessageMap.js` it also handles internationalization. This topic is covered in our [I18n Guide](~/lib/utilities/i18n.md).

### Customize Text Labels

You can change the text for the labels (like 'Sign In' and 'Sign Up') on the built-in user interface by providing your own dictionary to the localization engine:

```javascript
import { I18n } from 'aws-amplify';

const authScreenLabels = {
    en: {
        'Sign Up': 'Create new account',
        'Sign Up Account': 'Create a new account'
    }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);
```


### Customize Initial authState

You can change the initial auth state for your Authenticator. By default the initial state is `signIn` which will shows the `signIn` component.
If you want the `signUp` component shows first, you can do:
```javascript
<Authenticator authState='signUp'>
```

## Customize withAuthenticator HOC

The `withAuthenticator` HOC gives you some nice default authentication screens out-of-box. If you want to use your own components rather than provided default components, you can pass the list of customized components to `withAuthenticator`:

```javascript
import React, { Component } from 'react';
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

class App extends Component {
  render() {
    ...
  }
}

// This is my custom Sign in component
class MySignIn extends SignIn {
  render() {
    ...
  }
}

export default withAuthenticator(App, false, [
  <MySignIn/>,
  <ConfirmSignIn/>,
  <VerifyContact/>,
  <SignUp/>,
  <ConfirmSignUp/>,
  <ForgotPassword/>,
  <RequireNewPassword />
]);
```

If you would like to add custom styling to the UI components you can pass a custom theme object as a parameter to the withAuthenticator HOC using the instructions [above](#customize-ui-theme):

```javascript
export default withAuthenticator(App, false, [], null, MyTheme);
```
