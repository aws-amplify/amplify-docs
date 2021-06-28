PhotoSharing is a demonstration of building an iOS social networking App with [Amplify Libraries](~/lib/lib.md).

## App features

This app implements the following features
* Authentication with Cognito's HostedUI to perform user sign up, sign in, and sign out.
* Upload images using Amplify.Storage for storing user profile images and post images.
* Using DataStore to persist user and post models, with offline capabilities.
* Displaying a list of posts to the user and performing pagination to load more.

### Authentication

The app allows you to authenticate a user using `Amplify.Auth.signInWithWebUI` API. [See Sign in with Web UI for more details](~/lib/auth/signin_web_ui.md).

**Sign Up Flow:**
![Sign Up](~/images/sample-app/photosharing/sign-up-flow.png)

**Sign In Flow:**
![Sign In](~/images/sample-app/photosharing/sign-in-flow.png)

**Sign Out Flow:**
![Sign Out](~/images/sample-app/photosharing/sign-out-flow.png)

### Creating a new Post

Once the user has signed in, the app allows the user to create a new post using the plus icon located at the top right corner. Tapping on this will prompt the user to select from the photo library or take an photo with the camera. Once they have selected an image and entered a description for the post, the app will persist the Post using `Amplify.DataStore` and upload the image using `Amplify.Storage`.

> Recommendation: See [DataStore's Getting Started](~/lib/datastore/getting-started.md) guide and [Storage's Getting Started](~/lib/storage/getting-started.md) guide for an alternative walk through of their respective categories.

![Create Post](~/images/sample-app/photosharing/post-creation-flow.png)

### Uploading a user profile image

The app also allows the user to upload a profile image by selecting their default profile image icon, as shown below.

![Update Profile](~/images/sample-app/photosharing/profile-update-flow.png)

### Displaying List of Posts

Displaying a list of posts is accomplished using `Amplify.DataStore.query` API. See [DataStore's Query Data for more details](https://docs.amplify.aws/lib/datastore/data-access/q/platform/ios#query-data). The post image is retrieved using `AmplifyStorage.DownloadData` API. See [Storage's Download files for more details](https://docs.amplify.aws/lib/storage/download/q/platform/ios)

![Load Posts](~/images/sample-app/photosharing/posts-loading.png)

## Get Started

Go to the [amplify-ios-samples](https://github.com/aws-amplify/amplify-ios-samples) Github repository to get started.