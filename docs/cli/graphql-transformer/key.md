---
title: Index your data with keys
description: The @key directive makes it simple to configure custom index structures for @model types.
---

## @key

The `@key` directive makes it simple to configure custom index structures for `@model` types.

Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale but making it work for your access patterns requires a bit of forethought. DynamoDB query operations may use at most two attributes to efficiently query data. The first query argument passed to a query (the hash key) must use strict equality and the second attribute (the sort key) may use gt, ge, lt, le, eq, beginsWith, and between. DynamoDB can effectively implement a wide variety of access patterns that are powerful enough for the majority of applications.

When modeling your data during schema design there are common patterns that you may need to leverage. [We provide a fully working schema with 17 patterns related to relational designs](~/cli/graphql-transformer/dataaccess.md).

## Definition

```graphql
directive @key(fields: [String!]!, name: String, queryField: String) on OBJECT
```

**Argument**

| Argument  | Description  |
|---|---|
| fields  | A list of fields that should comprise the @key, used in conjunction with an `@model` type. The first field in the list will always be the **HASH** key. If two fields are provided the second field will be the **SORT** key. If more than two fields are provided, a single composite **SORT** key will be created from a combination of `fields[1...n]`. All generated GraphQL queries & mutations will be updated to work with custom `@key` directives. |
| name  | When provided, specifies the name of the secondary index. When omitted, specifies that the `@key` is defining the primary index. You may have at most one primary key per table and therefore you may have at most one `@key` that does not specify a **name** per `@model` type.  |
| queryField  | When defining a secondary index (by specifying the *name* argument), this specifies that a new top level query field that queries the secondary index should be generated with the given name.  |

## How to use @key

For an introduction to the `@key` directive, let's start by looking at a basic `Todo` app schema with only an `@model` directive.

```graphql
type Todo @model {
  id: ID!
  name: String!
  status: String!
}
```

By default, the `@model` directive will enable the following 2 data access patterns:

1. `getTodo` - Get a Todo by `id`
2. `listTodos` - Query all Todos

You will often need additional data access patterns. For example, in a Todo app, you may want to fetch Todos by `status`. The `@key` directive would allow you to add this additional data access pattern with a single new line of code:

```graphql
type Todo @model
  @key(name: "todosByStatus", fields: ["status"], queryField: "todosByStatus") {
  id: ID!
  name: String!
  status: String!
}
```

Using the new `todosByStatus` query you can fetch todos by `status`:

```graphql
query todosByStatus {
  todosByStatus(status: "completed") {
    items {
      id
      name
      status
    }
  }
}
```

Next, let's take a closer look at how this works by examining a few more common data access patterns and how to model them.

## Designing Data Models using @key

When designing data models using the `@key` directive, the first step should be to write down your application's expected access patterns. For example, let's say you were building an e-commerce application
and needed to implement access patterns like:

1. Get customers by email.
2. Get orders by customer by createdAt.
3. Get items by order by status by createdAt.
4. Get items by status by createdAt.

Let's take a look at how you would define custom keys to implement these access patterns in your `schema.graphql`.

### Example: Get customers by email

```graphql
type Customer @model @key(fields: ["email"]) {
  email: String!
  username: String
}
```

A `@key` without a *name* specifies the key for the DynamoDB table's primary index. You may only provide 1 `@key` without a *name* per `@model` type.

The example above shows the simplest case where you are specifying that the table's primary index should have a simple key where the hash key is *email*. This allows you to get unique customers by their *email*.

```graphql
query GetCustomerById {
  getCustomer(email:"me@email.com") {
    email
    username
  }
}
```

This is great for simple lookup operations, but what if you need to perform slightly more complex queries?

### Example: Get orders by customer email by createdAt

```graphql
type Order @model @key(fields: ["customerEmail", "createdAt"]) {
  customerEmail: String!
  createdAt: AWSDateTime!
  orderId: ID!
}
```

This `@key` above allows you to efficiently query *Order* objects by both a *customerEmail* and the *createdAt* time stamp. The `@key` above creates a DynamoDB table where the primary index's hash key is *customerEmail* and the sort key is *createdAt*. This allows you to write queries like this:

```graphql
query ListOrdersForCustomerIn2019 {
  listOrders(customerEmail:"me@email.com", createdAt: { beginsWith: "2019" }) {
    items {
      orderId
      customerEmail
      createdAt
    }
  }
}
```

The query above shows how you can use compound key structures to implement more powerful query patterns on top of DynamoDB but you are not quite done yet.

Given that DynamoDB limits you to query by at most two attributes at a time, the `@key` directive helps by streamlining the process of creating composite sort keys such that you can support querying by more than two attributes at a time. For example, you can implement “Get items by `orderId`, `status`, and `createdAt”` as well as “Get items by `status` and `createdAt”` for a single `@model` with this schema.

```graphql
type Item @model
  @key(fields: ["orderId", "status", "createdAt"])
  @key(name: "ByStatus", fields: ["status", "createdAt"], queryField: "itemsByStatus") {
  orderId: ID!
  status: Status!
  createdAt: AWSDateTime!
  name: String!
}
enum Status {
  DELIVERED
  IN_TRANSIT
  PENDING
  UNKNOWN
}
```

The primary `@key` with 3 fields performs a bit more magic than the 1 and 2 field variants. The first field orderId will be the **HASH** key as expected, but the **SORT** key will be a new composite key named *status#createdAt* that is made of the *status* and *createdAt* fields on the @model. The `@key` directive creates the table structures and also generates resolvers that inject composite key values for you during queries and mutations.

Using this schema, you can query the primary index to get IN_TRANSIT items created in 2019 for a given order.

```graphql
# Get items for order by status by createdAt.
query ListInTransitItemsForOrder {
  listItems(orderId:"order1", statusCreatedAt: { beginsWith: { status: IN_TRANSIT, createdAt: "2019" }}) {
    items {
      orderId
      status
      createdAt
      name
    }
  }
}
```

The query above exposes the *statusCreatedAt* argument that allows you to configure DynamoDB key condition expressions without worrying about how the composite key is formed under the hood. Using the same schema, you can get all PENDING items created in 2019 by querying the secondary index "ByStatus" via the `Query.itemsByStatus` field.

```graphql
query ItemsByStatus {
  itemsByStatus(status: PENDING, createdAt: {beginsWith:"2019"}) {
    items {
      orderId
      status
      createdAt
      name
    }
    nextToken
  }
}
```

## Evolving APIs with @key

There are a few important things to think about when making changes to APIs using `@key`. When you need to enable a new access pattern or change an existing access pattern you should follow these steps.

1. Create a new index that enables the new or updated access pattern.
2. If adding an `@key` with 3 or more fields, you will need to back-fill the new composite sort key for existing data. With a `@key(fields: ["email", "status", "date"])`, you would need to backfill the `status#date` field with composite key values made up of each object's *status* and *date* fields joined by a `#`. You do not need to backfill data for `@key` directives with 1 or 2 fields.
3. Deploy your additive changes and update any downstream applications to use the new access pattern.
4. Once you are certain that you do not need the old index, remove its `@key` and deploy the API again.

## Deploying multiple secondary indices (GSI)

You can make multiple global secondary index (`@key` with `name` parameter set) updates on one "amplify push". Under the hood, Amplify CLI needs to locally sequence multiple individual deployments to your DynamoDB table because each GSI change requires time to create the new index.

### Troubleshooting

If your deployment fails locally when updating multiple GSIs, you'll have the ability to run:

- `amplify push --iterative-rollback` to rollback the last-known-good state
- `amplify push --force` rollback the last-known-good state and try redeploying your changes again using.

```console
Attempting to mutate more than 1 global secondary index at the same time.
```

If you're running into the error above during `amplify push`, it is likely that you don't have this feature enabled. To enable multiple GSI updates, set the ["enableIterativeGsiUpdates" feature flag](~/cli/reference/feature-flags.md#enableIterativeGsiUpdates) to `true` in your `amplify/cli.json`.

## Combining @key with @connection

Secondary indexes created with the `@key` directive can be used to resolve connections when creating relationships between types. To learn how this works, check out [the documentation for @connection](~/cli/graphql-transformer/connection.md).
