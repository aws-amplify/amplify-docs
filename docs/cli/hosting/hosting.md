---
title: Overview
description: Deploy and host your app using either Amplify Console or Amazon CloudFront/S3. The Amplify Console offers fully managed hosting with features such as instant cache invalidation and atomic deploys.
---

Deploy and host your app using either Amplify Console or Amazon CloudFront/S3. The Amplify Console offers fully managed hosting with features such as instant cache invalidation and atomic deploys. For more control with setting up a CDN and hosting buckets, use CloudFront and S3.

## Workflow

- `amplify add hosting`<br/>
This adds the hosting resources to the backend. The command will first prompt for environment selection, either DEV or PROD. Upon completion, the CloudFormation template for the resources is placed in the amplify/backend/hosting directory. <br/><br/>
- `amplify configure hosting`<br/>
This command walks through the steps to configure the different sections of the resources used in hosting, including S3, CloudFront, and publish ignore. See below for more details.<br/><br/>
- `amplify publish`<br/>
The `amplify publish` command is designed to build and publish both the backend and the frontend of the project. In the current implementation, the frontend publish functionality is only available for a JavaScript project for static web hosting.<br/><br/>
- `amplify remove hosting`<br/>
This removes the hosting resources locally from the backend. On your next `amplify push` the provisioned hosting resources will get removed from the cloud. <br/><br/>

## Using AWS Amplify Console

<amplify-callout>

The AWS Amplify Console is a continuous deployment and hosting service for Amplify web apps. [Learn more](https://console.amplify.aws).

</amplify-callout>

The AWS Amplify Console provides a Git-based workflow for building, deploying, and hosting your Amplify web app — both the frontend and backend — from source control. Once you connect a feature branch, all code commits are automatically deployed to an `amplifyapp.com` subdomain or your custom domain. [Get Started](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)

Following are the concepts you would encounter when adding Amplify console as a hosting option for your Amplify app.

### Type of deployments

If you select Amplify Console for hosting your Amplify App in the `amplify add hosting` flow, there are two stages you can select from as a part of the flow:

- **Continuous deployment** allows you to publish changes on every code commit by connecting your GitHub, Bitbucket, GitLab, or AWS CodeCommit repositories. Selecting this option would open up your AWS Amplify console where you can connect your Git  repository. Once your repository is connected, run `git push` to deploy changes to both your backend and frontend in a single workflow.
- **Manual deployment** allows you to publish your web app to the Amplify Console without connecting a Git provider. If you select this option, you will have to run the `amplify publish` command every time you would like to see your changes reflected in the cloud.

In order to change deployment types, you need to run `amplify remove hosting` and then `amplify add hosting` to choose your new preferred deployment type.

### Custom domain, redirects, and more

The `amplify configure hosting` command for the Amplify Console option, opens up the AWS Amplify Console browser tab for you where you can configure settings such as rewrite/redirect URL's, password protection, custom domain.
These settings do not get replicated or cloned between environments and you'd have to configure them on a per-environment basis.

**Note:**

Amplify Console automatically handles cache invalidation and there is no additional configurations or commands/command-line parameters required for it.

If you start from the Amplify Console's home page and connect your project's code repository (by clicking `Connect app` button), the frontend environment is created for your project once the workflow successfully completes. After setting up hosting in the Amplify Console, you cannot run the `amplify hosting add` command from your local installation of the Amplify CLI. To disable hosting, please visit the Amplify Console and disconnect the branch from the `App settings > General` page.

If you're hosting a Single Page Web App (SPA) with routing such as [`react-router`](https://reactrouter.com/web/guides/quick-start), you'll need to add a [redirect](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) in the Amplify console.

![SPA redirect](~/images/hosting/spa-redirect.png)

## Amazon S3 and Amazon Cloudfront

The Amplify CLI provides you the option to manage the hosting of your static website using Amazon S3 and Amazon Cloudfront directly as well. Following are the concepts you would encounter when adding S3 & Cloudfront as a hosting option for your Amplify app.

### Stages

If you select Amazon S3 & Amazon Cloudfront for hosting your Amplify App in the `amplify add hosting` flow, there are two stages you can select from as a part of the flow:

- DEV:  S3 static web hosting
- PROD: S3 and CloudFront

It can take time to provision a CloudFront Distribution across the global CDN footprint, in some cases 15 minutes or more. Therefore the Amplify CLI provides a DEV configuration with an S3 static site only when prototyping your application; and a PROD configuration when you are ready to deploy in production. Note that the DEV stage using S3, your static site would not have HTTPS support and hence **only recommended for prototyping your app**.

Amazon CloudFront service can also be added or removed in your Amplify project later on top of your Amazon S3 bucket by using the `amplify hosting configure` command. Note that if the hosting S3 bucket is newly created in regions other than us-east-1, you might get the `HTTP 307 Temporary Redirect` error in the beginning when you access your published application through CloudFront. This is because CloudFront forwards requests to the default S3 endpoint (s3.amazonaws.com), which is in the us-east-1 region, and it can take up to 24 hours for the new hosting bucket name to propagate globally.

For more  information of the Amazon S3 and Amazon CloudFront, check their docs:
[S3 static web hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
[CloudFront DEV Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

### Cache Invalidation

If you select Amazon S3 & Amazon Cloudfront for hosting your Amplify App in the `amplify add hosting` flow, the frontend build artifacts will be uploaded to the S3 hosting bucket, and then if Amazon CloudFront is enabled along with it, the `amplify publish` command executed with the `--invalidateCloudFront` or `-c` flag will send an invalidation request to the Amazon CloudFront service to invalidate its cache.

### Advanced Configurations

The `amplify configure hosting` command walks through the steps to configure the different sections of the resources used when hosting through Amazon S3 & Amazon Cloudfront. Following are the available configurable options:

- `Website`<br/>
Configures the S3 bucket for static web hosting. You can set the index doc and error doc references by configuring this option. Both are set to be `index.html` by default.<br/><br/>
- `CloudFront`<br/>
Configures the CloudFront content delivery network (CDN). You can configure TTLs (Time To Live) for the default cache behavior, and configure custom error responses.<br/><br/>
- `Publish`<br/>
Configures the publish ignore patterns (similar to a .gitignore file in your git based project) for the publish command. The publish command will ignore these set of directories and files in the distribution folder that have names matching the patterns.<br/><br/>
- `Metadata`<br/>
Configures the patterns and metadata key/values for the publish command. The publish command will include the key/value in S3 for these sets of directories and files in the distribution folder that have names matching the patterns. The following keys are recognized as S3 System Parameters -  ContentType, CacheControl, ContentDisposition, ContentEncoding, ContentLanguage, Expires, WebsiteRedirectLocation. All other keys are added as S3 metadata.
