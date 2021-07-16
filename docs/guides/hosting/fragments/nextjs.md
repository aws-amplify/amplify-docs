In this guide you'll learn how to deploy a [Next.js](https://nextjs.org/) app using Amplify Hosting. Amplify supports the hosting of static apps and apps with dynamic server-side rendered routes (SSR). 

## Prerequisites

If you haven't already, install and configure the latest version of the Amplify CLI:

<inline-fragment src="~/fragments/cli-install-block.md"></inline-fragment>

```bash
amplify configure
```

> To see a video walkthrough of how to configure the CLI, click [here](https://www.youtube.com/watch?v=fWbM5DLh25U).


## Deploy and host an SSG only app

You can deploy static (SSG) apps with manual deployments or with Git-based continuous deployments. This example demonstrates how to manually deploy an SSG app.

### Getting started

Create a new Next.js app:

```sh
$ npm init next-app

✔ What is your project named? my-app
✔ Pick a template › Default starter app
```

Currently, Amplify doesn't fully support Image Component and Automatic Image Optimization available in Next.js 10. To manually deploy the `next-app` example, you must edit the **index.js** file to remove this feature. Navigate to `pages/index.js` and delete the following line near the top of the file:

````html
import Image from 'next/image'
````

 Next, locate the following `Image` tag:

````html
<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
````
Edit the tag to use the HTML `img` tag as follows:
````html
<img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
````

Next, change to the `my-app` directory to update the **package.json** file. When you deploy a Next.js app, Amplify inspects the app's build script in the **package.json** file to detect whether the app is static (SSG) or server-side rendered (SSR). 

To deploy a static app, add the `export` script to the existing `build` script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build && next export",
  "start": "next start"
},
```
The build script `next build && next export` indicates that the app supports SSG pages only.`next export` allows you to export your app to static HTML, which can be run standalone without the need of a Node.js server.

At last, change to eslint rule to update **.eslintrc** file. When you build a Next.js project, you will have an error since Next.js restrict an user to use `img` as `@next/next/no-img-element` eslint rule.

To build successfully, append the ignore rule to the existing `.eslintrc` below `extends` block:

```json
{
  "extends": ["next", "next/core-web-vitals"],
  "rules": {
    "@next/next/no-img-element": "off"
  }
}
```

### Adding Amplify hosting

Initialize a new Amplify project. The `Distribution Directory Path` depends on whether you are deploying a static or SSR app. For a static app, set the `Distribution Directory Path` to `out`.

```sh
$ amplify init

? Enter a name for the project: mynextapp
? Enter a name for the environment: dev
? Choose your default editor: Visual Studio Code (or your preferred editor)
? Choose the type of app that youre building: javascript
? What javascript framework are you using: react
? Source Directory Path: src
? Distribution Directory Path: out
? Build Command: npm run-script build
? Start Command: npm run-script start
? Do you want to use an AWS profile? Y
? Please choose the profile you want to use: <your profile>
```

Add hosting with the Amplify `add` command:

```sh
$ amplify add hosting

```console
? Select the plugin module to execute: # Hosting with Amplify Console
? Choose a type: # Manual deployment
```

Deploy the app with the Amplify `publish` command:

```sh
$ amplify publish

? Are you sure you want to continue? Yes
```

⚡️ Congratulations, your app has now been successfully deployed! The URL for the app should be displayed in your terminal.

![CLI Output](~/images/hosting/next/cli-output.png)

To see your app in the Amplify console at any time, run the following command:

```sh
$ amplify console
```

### Deploying updates

Once you make changes to your app and are ready to deploy them, you can run the `publish` command again:

```sh
$ amplify publish
```

### Deleting the app

To delete the app and the deployment, run the `delete` command:

```sh
$ amplify delete
```

### Dynamic routes

Next.js also supports dynamic routes.

Let's say you have a folder and file structure that looks like this:

```
/pages/posts/[id].js
```

This component needs to read the ID from the URL and do something useful with it in the app. To make this happen, we can use `next/router`:

```javascript
// /pages/posts/[id].js
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Post: {id}</p>
}

export default Post
```

To enable this, you need to set up a rewrite for __/pages/posts/[id].html__ in the __Rewrites and redirects__ section of the Amplify Console:

![Rewrites](~/images/hosting/next/rewrites.png)

## Deploy and host a hybrid app (SSG and SSR)

To deploy a hybrid (SSG and SSR) app, use Amplify's Git-based CI/CD and hosting service

### Getting started

Create a new Next.js app:

```sh
$ npm init next-app

✔ What is your project named? my-app
✔ Pick a template › Default starter app
```

When you deploy a Next.js app, Amplify inspects the app's build script in the **package.json** file to detect whether the app is static (SSG) or server-side rendered (SSR). Change into the `my-app` directory to view the **package.json** file. The build script `next build` indicates that the app supports both SSG and SSR pages.

To deploy an SSR app, keep the following default `build` script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
},
```


### Creating the Git repository 

Create a new Git repository for your project. For a Github repo, you can run the following commands in the root of your project to initialize the repo and push the code to Github:

```sh
$ git init
$ git remote add origin git@github.com:username/my-next-app.git
$ git add .
$ git commit -m 'initial commit'
$ git push origin main
```

### Adding Amplify hosting

Next, initialize a new Amplify project. The `Distribution Directory Path` that you set depends on whether you are deploying a static or SSR app.

For an SSR app, set the `Distribution Directory Path` to `.next`.

```sh
$ amplify init

? Enter a name for the project: mynextapp
? Enter a name for the environment: dev
? Choose your default editor: Visual Studio Code (or your preferred editor)
? Choose the type of app that youre building: javascript
? What javascript framework are you using: react
? Source Directory Path: src
? Distribution Directory Path: .next
? Build Command: npm run-script build
? Start Command: npm run-script start
? Do you want to use an AWS profile? Y
? Please choose the profile you want to use: <your profile>
```

Add hosting with the Amplify `add` command:

```sh
$ amplify add hosting

```console
? Select the plugin module to execute: # Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
? Choose a type: # Continuous deployment (Git-based deployments)
```
The Amplify Console opens and displays your deployed backend environment. 

![image](../../images/start-nextjs-deploy-1.png)

Choose the **Frontend environments** tab, select your Git provider, then choose **Connect Branch**.

![image](../../images/start-nextjs-deploy-2.png)

Follow the steps in the Amplify console to choose the branch to connect, and deploy your app. 

> **Note**: Your CloudFront Distribution may take several minutes to go from "In Progress" to "Active".  Visit your [CloudFront Console](https://console.aws.amazon.com/cloudfront/home) to monitor progress.

After your site is successfully deployed, you'll see four green checkmarks. To view the live site, click on the automatically generated URL circled in red in the following screenshot.

![image](../../images/start-nextjs-deploy-3.png)

⚡️ Congratulations, your app has now been successfully deployed! 

### Kicking off a new build

You can kick off a new build directly from the Amplify console or by pushing changes to main.

1. Make some changes to your code

2. Push the changes to git

```sh
$ git add .
$ git commit -m 'updates'
$ git push origin main
```

## API routes
Amplify now supports API routes in Next.js apps. Any file inside the folder `pages/api` is mapped to `/api/*` and treated as an API endpoint instead of a page. You can use these APIs to interface with any backend service to fetch data.
