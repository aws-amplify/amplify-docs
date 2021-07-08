---
title: Feature Flags
description: More information about feature flags in Amplify CLI
---

Feature flags makes it possible to fine tune given functionality in the Amplify CLI.

They are grouped into sections based on the area of the functionality. An area can be a category or some other scope. There are different type of feature flags defined, their lifetime is controlled the lifecycle process.

## Types of feature flags

### Release

These types of feature flags are used to enable or disable a given functionality in Amplify CLI that is under active development. These feature flags are removed and become unsupported once a feature has been shipped.

### Feature

During the history of the Amplify CLI there are enhancements that can benefit for new projects but potentially can cause breaking changes in existing deployments. These feature flags are controlled by the lifecycle process to provide time for mitigation and migration. These type of flags are disabled for existing projects and enabled for new ones.

Examples

- Breaking existing projects by generating different code and would require a backend deployment.
- The push operation of a changed resource would require a resource recreation that could lead to data loss.
- The push operation of a changed resource would require data backfill to make the client application operable.
- The generated code for client applications would require a rebuild and republish to be compatible with the newly pushed backend.

### Experimental

Experimental feature flags are to enable experimentation with given functionality, to provide feedback to the Amplify CLI team. Enabling these feature in production is highly discouraged.

The outcome of experimental features can be:

- The feature will make into the product so it will be turned into a Release type feature flag.
- The experimental feature is not making into the product and removed from the codebase together with the code itself.

## Lifecycle

Each type of feature flags are managed under a lifecycle management process. When a feature flag is added to the Amplify CLI it will be mentioned in the release notes and also this page will be updated with the detailed information. After adding a feature flag this page will contain information about what version a feature flag was added, what is the planned deprecation date - if there is one -,  in which version the feature flag was deprecated, in which version the feature flag was removed.

When a feature flag is deprecated it still can be used but when used a warning will be printed on the screen during the execution of Amplify CLI commands.

Before removal a removal date is added to the feature flag, and after a feature flag is removed Amplify CLI will shows an error message about it and the version the feature flag was removed added to the page.

## Configuration

Configuration of feature flags are primarily done by having an `cli.json` file in the project's `amplify` folder. If the file does not exist Amplify CLI creates it during the `amplify init` command. The emitted values are representing the default values for new projects. This file must be under version control, to make sure that the same features are used locally, in CI/CD environments, between team members. If an environment specific file exists for the currently checked out environment, during `amplify env add` command the same file will be copied for the newly created environment as well.

Example configuration file

```json
{
  "features": {
    "graphQLTransformer": {
      "addMissingOwnerFields": true,
      "validateTypeNameReservedWords": true,
      "useExperimentalPipelinedTransformer": false,
      "enableIterativeGSIUpdates": false,
      "skipOverrideMutationInputTypes": true,
    },
    "frontend-ios": {
      "enableXcodeIntegration": true
    },
    "auth": {
      "enableCaseInsensitivity": true,
      "useInclusiveTerminology": true,
      "breakCircularDependency": true
    },
    "codegen": {
      "useAppSyncModelgenPlugin": true
    }
  }
}
```

If for some reason different functionality is needed to be enabled for a given Amplify CLI environment a copy can be made of the project level file with the following naming convention: `cli.{environment name}.json`.

### Environment variables

Amplify CLI supports the definition and override of feature flags values from environment variables and `.env` files as well.

The environment variables must follow a naming convention, to be picked up by Amplify CLI:

- Project level override: `AMPLIFYCLI_{SECTION}__{PROPERTY}`, for example: `AMPLIFYCLI_GRAPHQLTRANSFORMER__TRANSFORMERVERSION`
- Environment specific override: `AMPLIFYCLI_{ENVNAME}_{SECTION}__{PROPERTY}`, for example: `AMPLIFYCLI_PROD_GRAPHQLTRANSFORMER__TRANSFORMERVERSION`

If a `.env` file is used in the project's root folder, then it is being merged on top of the current process' environment variables, overwriting those.

### Order of evaluation

Due to the multiple levels of configuration options and overrides, Amplify CLI does a top-to-bottom evaluation as follows:

- `cli.json`
- `cli.{environment name}.json`
- Project level environment variables
- CLI Environment level environment variables

## Feature flags

<amplify-feature-flags />
