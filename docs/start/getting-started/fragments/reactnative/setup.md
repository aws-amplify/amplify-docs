To start off, you'll need a React Native project. If you have an existing project, you can skip to [initialize a new backend](#initialize-a-new-backend).

##  Create a new React Native app

To get started, initialize a new React Native project.

<amplify-block-switcher>
<amplify-block name="Expo">

```bash
npm install -g expo-cli  
expo init RNAmplify

? Choose a template: blank
```

</amplify-block>
<amplify-block name="React Native CLI">

```bash
npx react-native init RNAmplify
```

</amplify-block>
</amplify-block-switcher>

## Initialize a new backend

You are now ready to initialize a new Amplify project. To do so, change into the project directory

```bash
cd RNAmplify
```

and use the Amplify CLI to create the project:

```bash
amplify init
```

```console
? Enter a name for the project: rnamplify
? Enter a name for the environment: demo
? Choose your default editor: <Your favorite text editor>
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react-native
? Source Directory Path:  ./
? Distribution Directory Path: ./
? Build Command:  npm run-script build
? Start Command: npm run-script start
? Do you want to use an AWS profile? Y
? Please choose the profile you want to use: <Your AWS profile from the configuration step>
```

When you initialize a new Amplify project, a few things happen:

- It creates a top level directory called `amplify` that stores your backend definition. During the tutorial you'll add capabilities such as a GraphQL API and authentication. As you add features, the `amplify` folder will grow with infrastructure-as-code templates that define your backend stack. Infrastructure-as-code is a best practice way to create a replicable backend stack.
- It creates a file called `aws-exports.js` in the `src` directory that holds all the configuration for the services you create with Amplify. This is how the Amplify client is able to get the necessary information about your backend services.
- It modifies the `.gitignore` file, adding some generated files to the ignore list.
- A cloud project is created for you in the AWS Amplify Console that can be accessed by running `amplify console`. The Console provides a list of backend environments, deep links to provisioned resources per Amplify category, status of recent deployments, and instructions on how to promote, clone, pull, and delete backend resources.

## Install Amplify libraries

Next, install the local Amplify dependencies. The directions here will depend on whether you are using Expo or the React Native CLI.

<inline-fragment src="~/start/getting-started/fragments/reactnative/getting-started-steps-ui.md"></inline-fragment>

Finally, open __App.js__ (Expo) or __index.js__ (React Native CLI) and add the following lines of code at the top of the file below the last import:

```javascript
import Amplify from 'aws-amplify'
import config from './src/aws-exports'
Amplify.configure(config)
```

Now your project is set up and you can begin adding new features.
