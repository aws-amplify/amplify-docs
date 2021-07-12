## Customization 

### Customize Object Key Path 

<inline-fragment platform="js" src="~/lib/storage/fragments/js/configureaccess/50_custom_prefix.md"></inline-fragment>
<inline-fragment platform="ios" src="~/lib/storage/fragments/ios/configureaccess/50_custom_prefix.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/storage/fragments/android/configureaccess/50_custom_prefix.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/storage/fragments/flutter/configureaccess/50_custom_prefix.md"></inline-fragment>

The above example corresponds to the following IAM policies. If you want to enable read, write and delete operation for all the objects under path *myPublicPrefix/* for authenticated and/or unauthenticated users, add this IAM policy to the corresponding role:

```xml
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
        ],
        "Resource": [
            "arn:aws:s3:::your-s3-bucket/myPublicPrefix/*",
        ]
    },
    {
        "Condition": {
            "StringLike": {
                "s3:prefix": [
                    "myPublicPrefix/",
                    "myPublicPrefix/*"
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
```

If you want to have a custom *protected* path prefix like *myProtectedPrefix/* that is writable by all authenticated users, and only readable by an unauthenticated users, add this IAM policy to the auth role:

```xml
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
        ],
        "Resource": [
            "arn:aws:s3:::your-s3-bucket/myProtectedPrefix/*"
        ]
    },
    {
        "Condition": {
            "StringLike": {
                "s3:prefix": [
                    "myProtectedPrefix/",
                    "myProtectedPrefix/*"
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
```

And this to the unauth role:
```xml
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject"
        ],
        "Resource": [
            "arn:aws:s3:::your-s3-bucket/myProtectedPrefix/*"
        ]
    },
    {
        "Condition": {
            "StringLike": {
                "s3:prefix": [
                    "myProtectedPrefix/",
                    "myProtectedPrefix/*"
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
```

If you want to have custom *private* path prefix like *myPrivatePrefix/* for authenticated users, add this IAM policy to the auth role:
```xml
"Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
        ],
        "Resource": [
            "arn:aws:s3:::your-s3-bucket/myPrivatePrefix/${cognito-identity.amazonaws.com:sub}/*"
        ]
    },
    {
        "Condition": {
            "StringLike": {
                "s3:prefix": [
                    "myPrivatePrefix/${cognito-identity.amazonaws.com:sub}/",
                    "myPrivatePrefix/${cognito-identity.amazonaws.com:sub}/*"
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
```
This ensures only the authenticated users has the access to the objects that they create under the path.

If you have IAM policies with an existing bucket, See [Use an existing S3 bucket](~/cli/storage/import.md) for more details on importing your S3 bucket.

### Customize based on Cognito user pool groups

If you want to configure access based on Cognito User Pool Groups, See [User groups](~/cli/auth/groups.md).

<inline-fragment platform="js" src="~/lib/storage/fragments/js/configureaccess/60_custom_prefix_groups.md"></inline-fragment>
<inline-fragment platform="ios" src="~/lib/storage/fragments/ios/configureaccess/60_custom_prefix_groups.md"></inline-fragment>
<inline-fragment platform="android" src="~/lib/storage/fragments/android/configureaccess/60_custom_prefix_groups.md"></inline-fragment>
<inline-fragment platform="flutter" src="~/lib/storage/fragments/flutter/configureaccess/60_custom_prefix_groups.md"></inline-fragment>

