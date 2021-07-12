---
title: User groups
description: Create logical groups in Cognito User Pools and assign permissions to access resources in Amplify categories with the Amplify CLI.
---

You can create logical groups in Cognito User Pools and assign permissions to access resources in Amplify categories with the CLI, as well as define the relative precedence of one group to another. This can be useful for defining which users should be part of "Admins" vs "Editors", and if the users in a Group should be able to just write or write & read to a resource (AppSync, API Gateway, S3 bucket, etc). [You can also use these with `@auth` Static Groups in the GraphQL Transformer](~/cli/graphql-transformer/auth.md#static-group-authorization). Precedence helps remove any ambiguity on permissions if a user is in multiple Groups.

## Create user groups

```bash
amplify add auth
```

```console
❯ Manual configuration

Do you want to add User Pool Groups? (Use arrow keys)
❯ Yes

? Provide a name for your user pool group: Admins
? Do you want to add another User Pool Group Yes
? Provide a name for your user pool group: Editors
? Do you want to add another User Pool Group No
? Sort the user pool groups in order of preference …  (Use <shift>+<right/left> to change the order)
  Admins
  Editors
```

When asked as in the example above, you can press `Shift` on your keyboard along with the **LEFT** and **RIGHT** arrows to move a Group higher or lower in precedence. Once complete you can open `amplify/backend/auth/userPoolGroups/user-pool-group-precedence.json` to manually set the precedence.

## Group access controls

For certain Amplify categories you can restrict access with CRUD (Create, Read, Update, and Delete) permissions, setting different access controls for authenticated users vs Guests (e.g. Authenticated users can read & write to S3 buckets while Guests can only read). You can further restrict this to apply different permissions conditionally depending on if a logged-in user is part of a specific User Pool Group.

```bash
amplify add storage  # Select content
```

```console
? Restrict access by? (Use arrow keys)
  Auth/Guest Users
  Individual Groups
❯ Both
  Learn more

Who should have access?
❯ Auth and guest users

What kind of access do you want for Authenticated users?
❯ create/update, read

What kind of access do you want for Guest users?
❯ read

Select groups:
❯ Admins

What kind of access do you want for Admins users?
❯ create/update, read, delete
```

The above example uses a combination of permissions where users in the "Admins" Group have full access, "Guest" users can only read, and "Authenticated" users who are not a part of any group have create, update, and read access. Amplify will configure the corresponding IAM policy on your behalf. Advanced users can additionally set permissions by adding a `customPolicies` key to `amplify/backend/auth/userPoolGroups/user-pool-group-precedence.json` with custom IAM policy for a Group. This will attach an inline policy on the IAM role associated to this Group during deployment. **Note**  this is an advanced feature and only suitable if you have an understanding of AWS resources. For instance perhaps you wanted users in the "Admins" group to have the ability to Create an S3 bucket:

```json
[
  {
    "groupName": "Admins",
    "precedence": 1,
    "customPolicies": [
      {
        "PolicyName": "admin-group-policy",
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "statement1",
              "Effect": "Allow",
              "Action": ["s3:CreateBucket"],
              "Resource": ["arn:aws:s3:::*"]
            }
          ]
        }
      }
    ]
  },
  {
    "groupName": "Editors",
    "precedence": 2
  }
]
```

If you would like users in the Editors group access to their own key path:
```json
[
  {
    "groupName": "Editors",
    "precedence": 2,
    "customPolicies": [
      {
        "PolicyName": "Editors-Protected-Group-Policy",
        "PolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "EditorsProtectedGroup",
              "Effect": "Allow",
              "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
              ],
              "Resource": ["arn:aws:s3:::your-s3-bucket/editorGroup/*"]
            },
            {
              "Condition": {
                  "StringLike": {
                      "s3:prefix": [
                          "editorGroup/",
                          "editorGroup/*"
                      ]
                  }
              },
              "Action": [
                  "s3:ListBucket"
              ],
              "Resource": [
                  "arn:aws:s3:::your-s3-bucket"
              ],
              "Effect": "Allow"
            }
          ]
        }
      }
    ]
  }
]
```

Cognito users in the Editors group will have access to perform all storage operations for keys under the `editorGroup` path. To perform operations using the Amplify library, see [Customize based on Cognito user pool groups](~/lib/storage/configureaccess.md#customize-based-on-cognito-user-pool-groups) for more details.