---
---
# Hub

AWS Amplify has a local event bus system called Hub. It is a lightweight implementation of Publisher-Subscriber pattern, and is used to share data between modules and components in your app.

## Installation

Import:
```javascript
import { Hub } from 'aws-amplify';

// or
import { Hub } from '@aws-amplify/core';
```

## Working with the API

### dispatch()

You can dispatch an event with `dispatch` function:
```javascript
Hub.dispatch('auth', { event: 'signIn', data: user }, 'Auth');
```

### listen()

You can subscribe to a channel with `listen` function:
```javascript
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('MyClass');

class MyClass {
    constructor() {
        Hub.listen('auth', this, 'MyListener');
    }

    // Default handler for listening events
    onHubCapsule(capsule) {
        const { channel, payload } = capsule;
        if (channel === 'auth') { this.onAuthEvent(payload); }
    }

    onAuthEvent(payload) {
        // ... your implementation
    }
}
```

In order to capture event updates, you need to implement `onHubCapsule` handler function in your listener class.
{: .callout .callout--info}

### Listening Authentication Events

AWS Amplify Authentication module publishes in `auth` channel when 'signIn', 'signUp', and 'signOut' events happen. You can create your listener to listen and act upon those event notifications.

```javascript
import { Hub, Logger } from 'aws-amplify';

const alex = new Logger('Alexander_the_auth_watcher');

alex.onHubCapsule = (capsule) => {

    switch (capsule.payload.event) {
    
        case 'signIn':
            alex.error('user signed in'); //[ERROR] Alexander_the_auth_watcher - user signed in
            break;
        case 'signUp':
            alex.error('user signed up');
            break;
        case 'signOut':
            alex.error('user signed out');
            break;
        case 'signIn_failure':
            alex.error('user sign in failed');
            break;
        case 'configured':
            alex.error('the Auth module is configured');
            
    }
}

Hub.listen('auth', alex);
```

### API Reference

For the complete API documentation for Hub module, visit our [API Reference](https://aws-amplify.github.io/amplify-js/api/classes/hubclass.html)
{: .callout .callout--info}
