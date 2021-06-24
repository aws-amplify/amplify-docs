---
title: Configure HTTP resolvers
description: The `@http` directive allows you to quickly connect HTTP or HTTPS endpoint to an AppSync API by creating an AWS AppSync HTTP resolver.
---

## @http

The `@http` directive allows you to quickly configure HTTP resolvers within your AWS AppSync API.

### Definition

```graphql
directive @http(method: HttpMethod, url: String!, headers: [HttpHeader]) on FIELD_DEFINITION
enum HttpMethod { PUT POST GET DELETE PATCH }
input HttpHeader {
  key: String
  value: String
}
```

### Usage

The `@http` directive allows you to quickly connect HTTP or HTTPS endpoint to an AppSync API by creating an AWS AppSync HTTP resolver. To connect to an endpoint, add the `@http` directive to a field in your `schema.graphql` file. The directive allows you to define URL path parameters, and specify a query string and/or specify a request body. For example, given the definition of a post type,

```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
}

type Query {
  listPosts: Post @http(url: "https://www.example.com/posts")
}
```

Amplify generates the definition below that sends a request to the url when the `listPosts` query is used.

```graphql
type Query {
  listPosts: Post
}
```

**Request Headers**

The `@http` directive generates resolvers that can handle xml and json responses. If an HTTP method is not defined, `GET` is used by default. You can specify a list of static headers to be passed with the HTTP requests to your backend in your directive definition.

```graphql
type Query {
  listPosts: Post
    @http(
      url: "https://www.example.com/posts"
      headers: [{ key: "X-Header", value: "X-Header-Value" }]
    )
}
```

**Path Parameters**

You can create dynamic paths by specifying parameters in the directive URL by using the special `:<parameter>` notation. Your set of parameters can then be specified in the `params` input object of the query. Note that path parameters are not added to the request body or query string. You can define multiple parameters.

Given the definition

```graphql
type Query {
  getPost: Post @http(url: "https://www.example.com/posts/:id")
}
```

Amplify generates

```graphql
type Query {
  getPost(params: QueryGetPostParamsInput!): Post
}

input QueryGetPostParamsInput {
  id: String!
}
```

You can fetch a specific post by enclosing the `id` in the `params` input object.

```graphql
query post {
  getPost(params: {id: "POST_ID"}) {
    id
    title
  }
}
```

which will send

```text
GET /posts/POST_ID
Host: www.example.com
```

**Query String**

You can send a query string with your request by specifying variables for your query. The query string is supported with all request methods.

Given the definition

```graphql
type Query {
  listPosts(sort: String!, from: String!, limit: Int!): Post
    @http(url: "https://www.example.com/posts")
}
```

Amplify generates

```graphql
type Query {
  listPosts(query: QueryListPostsQueryInput!): Post
}

input QueryListPostsQueryInput {
  sort: String!
  from: String!
  limit: Int!
}
```

You can query for posts using the `query` input object

```graphql
query posts{
  listPosts(query: {sort: "DESC", from: "last-week", limit: 5}) {
    id
    title
    description
  }
}
```

which sends the following request:

```text
GET /posts?sort=DESC&from=last-week&limit=5
Host: www.example.com
```

**Request Body**

The `@http` directive also allows you to specify the body of a request, which is used for `POST`, `PUT`, and `PATCH` requests. To create a new post, you can define the following.

```graphql
type Mutation {
  addPost(title: String!, description: String!, views: Int): Post
    @http(method: POST, url: "https://www.example.com/post")
}
```

Amplify generates the `addPost` query field with the `query` and `body` input objects since this type of request also supports a query string. The generated resolver verifies that non-null arguments (e.g.: the `title` and `description`) are passed in at least one of the input objects; if not, an error is returned.

```graphql
type Mutation {
  addPost(query: QueryAddPostQueryInput, body: QueryAddPostBodyInput): Post
}

input QueryAddPostQueryInput {
  title: String
  description: String
  views: Int
}

input QueryAddPostBodyInput {
  title: String
  description: String
  views: Int
}
```

You can add a post by using the `body` input object:

```graphql
mutation add {
  addPost(body: {title: "new post", description: "fresh content"}) {
    id
  }
}
```

which will send

```text
POST /post
Host: www.example.com
{
  title: "new post"
  description: "fresh content"
}
```

**Specifying the environment**

The `@http` directive allows you to use `${env}` to reference the current Amplify CLI environment.

```graphql
type Query {
  listPosts: Post @http(
    url: "https://www.example.com/${env}/posts"
  )
}
```

which, in the `DEV` environment, will send

```text
GET /DEV/posts
Host: www.example.com
```

**Specifying the region**

The `@http` directive allows you to use `${region}` to reference the AWS region of your environment.

```graphql
type Query {
  listPosts: Post @http(
    url: "https://www.example.com/${region}/posts"
  )
}
```

which, in the `us-east-1` region, will send

```
GET /us-east-1/posts
Host: www.example.com
```

**Combining the different components**

You can use a combination of parameters, query, body, headers, and environments in your `@http` directive definition.

Given the definition

```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
  comments: [Comment]
}

type Comment {
  id: ID!
  content: String
}

type Mutation {
  updatePost(
    title: String!
    description: String!
    views: Int
    withComments: Boolean
  ): Post
    @http(
      method: PUT
      url: "https://www.example.com/${env}/posts/:id"
      headers: [{ key: "X-Header", value: "X-Header-Value" }]
    )
}
```

you can update a post with

```graphql
mutation update {
  updatePost(
    body: {title: "new title", description: "updated description", views: 100}
    params: {id: "EXISTING_ID"}
    query: {withComments: true}) {
    id
    title
    description
    comments {
      id
      content
    }
  }
}
```

which, in the `DEV` environment, will send

```text
PUT /DEV/posts/EXISTING_ID?withComments=true
Host: www.example.com
X-Header: X-Header-Value
{
  title: "new title"
  description: "updated description"
  views: 100
}
```

**Advanced cases**

In some cases, you may want to send a request based on existing field data. Take a scenario where you have a post and want to fetch comments associated with the post in a single query. Let's use the previous definition of `Post` and `Comment`.

```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
  comments: [Comment]
}

type Comment {
  id: ID!
  content: String
}
```

A post can be fetched at `/posts/:id` and a post's comments at `/posts/:id/comments`. You can fetch the comments based on the post id with the following updated definition. `$ctx.source` is a map that contains the resolution of the parent field (`Post`) and gives access to `id`.

```graphql
type Post {
  id: ID!
  title: String
  description: String
  views: Int
  comments: [Comment]
    @http(url: "https://www.example.com/posts/${ctx.source.id}/comments")
}

type Comment {
  id: ID!
  content: String
}

type Query {
  getPost: Post @http(url: "https://www.example.com/posts/:id")
}
```

You can retrieve the comments of a specific post with the following query and selection set.

```graphql
query post {
  getPost(params: {id: "POST_ID"}) {
    id
    title
    description
    comments {
      id
      content
    }
  }
}
```

Assuming that `getPost` retrieves a post with the id `POST_ID`, the comments field is resolved by sending this request to the endpoint

```text
GET /posts/POST_ID/comments
Host: www.example.com
```

Note that there is no check to ensure that the reference variable (here the post ID) exists. When using this technique, it is recommended to make sure the referenced field is non-null.

### Generates

The `@http` transformer will create one HTTP datasource for each identified base URL. For example, if multiple HTTP resolvers are created that interact with the "https://www.example.com" endpoint, only a single datasource is created. Each directive generates one resolver. Depending on the definition, the appropriate `body`, `params`, and `query` input types are created. Note that `@http` transformer does not support calling other AWS services where Signature Version 4 signing process is required.
