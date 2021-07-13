---
title: Multiple frontends
description: Learn how to share the same Amplify backend across multiple frontends (e.g, a React and Android app).
---

Use the `amplify pull` command to share the same Amplify backend across multiple frontends (e.g, a React and Android app). Users have an option to pull the entire backend definition (infrastructure templates and metadata) or only the metadata required to connect to the backend (e.g. `aws-exports.js` for JavaScript apps, or `amplifyconfiguration.json` for Android and iOS apps). If you’re building a mobile and web app in separate repositories, the recommended workflow is to keep the backend definition (the amplify folder) in only one of the repositories and pull the metadata (the `aws-exports.js` or `amplifyconfiguration.json` file) in the second repository to connect to the same backend.

## Workflow

This workflow outlines the steps required to share a backend across two (or more) frontends. This example scenario is for a team building an Android and React app.

![Image](~/images/multiple-frontends.png)

1. Initialize a backend for your React app. This will create an Amplify project and backend environment that is accessible in the Amplify Console (by running `amplify console`).

 ```console
     $ cd my-react-app
     $ amplify init
  ? Enter a name for the project: ecommerce
  ? Choose the type of app that you're building: react
     $ amplify add api
     $ amplify push
 ```

2. Make your frontend changes and commit the code to Git. Your Git repository now stores the `amplify` folder which contains the definition of your infrastructure.

3. Reference the backend from your Android app using the `amplify pull` command. Choose 'No' when asked if you want to modify or add new categories to your backend. This will put only the metadata file (`aws-exports.js` or `amplifyconfiguration.json`) in your `src` folder. Choosing 'Yes' will work, however your backend definition will now be stored in two separate repositories leading to unintended consequences with multiple sources of truth.

 ```console
   cd my-android-app
   amplify pull
  ? Which app are you working on?
    > ecommerce
      mysecretproject
  ? Choose the type of app that you're building: #android
  ? Do you plan on modifying this backend?: #n
   Successfully pulled backend environment dev from the cloud.
   Run 'amplify pull' to sync future upstream changes.
 ```
