---
title: Versioning and conflict resolution
description: The @versioned directive adds object versioning and conflict resolution to a type.
---

## @versioned

The `@versioned` directive adds object versioning and conflict resolution to a type. Do not use this directive when leveraging DataStore as the conflict detection and resolution features are automatically handled inside AppSync and are incompatible with the `@versioned` directive.

<amplify-callout>

Note that **@versioned** is only supported in client code generated via AppSync [codegen](~/cli/graphql-transformer/codegen).
Versioning is not supported in models generated via `amplify codegen models`.

</amplify-callout>

### Definition

```graphql
directive @versioned(versionField: String = "version", versionInput: String = "expectedVersion") on OBJECT
```

### Usage

Add `@versioned` to a type that is also annotate with `@model` to enable object versioning and conflict detection for a type.

```graphql
type Post @model @versioned {
  id: ID!
  title: String!
  version: Int!   # <- If not provided, it is added for you.
}
```

**Creating a Post automatically sets the version to 1**

```graphql
mutation Create {
  createPost(input:{
    title:"Conflict detection in the cloud!"
  }) {
    id
    title
    version  # will be 1
  }
}
```

**Updating a Post requires passing the "expectedVersion" which is the object's last saved version**

> Note: When updating an object, the version number will automatically increment.

```graphql
mutation Update($postId: ID!) {
  updatePost(
    input:{
      id: $postId,
      title: "Conflict detection in the cloud is great!",
      expectedVersion: 1
    }
  ) {
    id
    title
    version # will be 2
  }
}
```

**Deleting a Post requires passing the "expectedVersion" which is the object's last saved version**

```graphql
mutation Delete($postId: ID!) {
  deletePost(
    input: {
      id: $postId,
      expectedVersion: 2
    }
  ) {
    id
    title
    version
  }
}
```

Update and delete operations will fail if the **expectedVersion** does not match the version
stored in DynamoDB. You may change the default name of the version field on the type as well as the name
of the input field via the **versionField** and **versionInput** arguments on the `@versioned` directive.

### Generates

The `@versioned` directive manipulates resolver mapping templates and will store a `version` field in versioned objects.
