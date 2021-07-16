---
title: Amplify Codegen Models - List and list components nullability
description: Generating Amplify models with Amplify CLI 5.1.2
---

### **What is changing?** 

Amplify CLI 5.1.2 has updated the codegen process to correctly set the optionality for types in models.

_Schema example_

```
type ListStringContainer @model {
  requiredElementRequiredList: [String!]!
  requiredElementOptionalList: [String!]
  optionalElementRequiredList: [String]!
  optionalElementOptionalList: [String]
}
```

In this example, there are four fields with different combinations of optionality:
- `requiredElementRequiredList` - the list itself is required. Elements it contains must be non-null. Empty lists can only be represented as an empty array.
- `requiredElementOptionalList` - the list itself is optional. If present, elements it contains must be non-null. Empty lists could be represented as either an empty array or a null field.
- `optionalElementRequiredList` - the list itself is required. If present, elements it contains may be null.
- `optionalElementOptionalList` - the list itself is optional. If present, elements it contains may be null.

> The list component in this example is a String type, however, this applies for other types as well such as Int, Bool, and embedded types that you define yourself.

### **Why are we introducing this change?** 

This is to align the optionality of the generated Swift models as closely as possible to the type defined in the schema.

### **Who is impacted?** 

<amplify-block-switcher>

<amplify-block name="iOS">

Developers building an iOS app with Amplify DataStore or Amplify API generates Swift models by running the command `amplify codegen models`. 

 _Previous generated Swift code_

```swift
public struct ListStringContainer: Model {
  public var requiredElementRequiredList: [String]
  public var requiredElementOptionalList: [String]
  public var optionalElementRequiredList: [String]?
  public var optionalElementOptionalList: [String]?
  ...
}
```

_Current code generated Swift code_

```swift
public struct ListStringContainer: Model {
  public var requiredElementRequiredList: [String]
  public var requiredElementOptionalList: [String]?
  public var optionalElementRequiredList: [String?]
  public var optionalElementOptionalList: [String?]?
  ...
}
```

The difference between the current and previous code:

- `requiredElementRequiredList` - No changes
- `requiredElementOptionalList` - the list was required and is now optional.
- `optionalElementRequiredList` - the list component was required and is now optional. The list was optional and is now required
- `optionalElementOptionalList` - the list component was required and is now optional. 

</amplify-block>

</amplify-block-switcher>


### **When do I have to upgrade?**

This is behind a feature flag in Amplify CLI 5.1.2 and will be deprecated by November 1st, 2021. Developers with existing apps should upgrade to the latest CLI, set the feature flag, and update their app code or their schema (see recommendations following) to account for the change in optionality of the types. Developers building a new app will automatically generate code with the latest changes and no action is required.

### **Where do I make these changes?**

1. Update Amplify CLI to the latest version

```
amplify upgrade
```

2. The version should be at least 5.1.2

```
amplify --v # at least 5.1.2
```

3. If building an existing app, set the feature flag `handleListNullabilityTransparently` to `true` in `cli.json` at the amplify project root.

4. Run `amplify codegen models` to generate the latest models.

5. Open the App and make sure the app compiles with the latest generated models. Depending on your schema, you may be in the following scenarios.

<amplify-block-switcher>

<amplify-block name="iOS">

Scenario 1. Schema: `requiredElementOptionalList: [String!]`

```swift
// Previous - Swift type
public var requiredElementOptionalList: [String]

// Current - Swift type
public var requiredElementOptionalList: [String]?

// Previous - Code 
print(container.requiredElementOptionalList) // ["value1", "value2"]

// Current - Code
if let requiredElementList = container.requiredElementOptionalList { 
    print(requiredElementList) // ["value1", "value2"]
}
```

Since the list was required and is now optional, unwrap the optional to retrieve the values.

**Recommendation:** Update the type in the schema from `[String!]` to`[String!]!` to make the list required if you do not have an app use case for storing a null list. This will remove the need to unwrap the list in code.

 Scenario 2. Schema: `optionalElementRequiredList: [String]!`

```swift
// Previous - Swift type
public var optionalElementRequiredList: [String]?

// Current - Swift type
public var optionalElementRequiredList: [String?]

// Previous - Code
if let optionalElementRequiredList = container.optionalElementRequiredList { 
    print(optionalElementRequiredList) // ["value1", "value2"]
    for value in optionalElementRequiredList {
        print(value) // "value1", "value2
    }
}

// After
print(container.optionalElementRequiredList) // [Optional("value1"), Optional("value2")]
for value in container.optionalElementRequiredList {
    if let value = value {
        print(value) // "value1", "value2
    }
}
```

Since the list component was required and is now optional, unwrap the optional value to retrieve the value. The list was optional and is now required, remove any unwrapping done for the list.

**Recommendation:** Update the type in the schema from `[String]!` to `[String!]!` to make the list component required if you do not store null values in the list. This will remove the need to unwrap the list component in code.

Scenario 3. Schema: `optionalElementOptionalList: [String]`

```swift
// Previous - Swift type
public var optionalElementOptionalList: [String]?

// Current - Swift type
public var optionalElementOptionalList: [String?]?

// Previous - Code
if let optionalElementOptionalList = container.optionalElementOptionalList { 
    print(optionalElementOptionalList) // ["value1", "value2"]
    for value in optionalElementOptionalList {
        print(value) // "value1", "value2
    }
}

// After
if let optionalElementList = container.optionalElementOptionalList { 
    print(optionalElementList) // [Optional("value1"), Optional("value2")]
    for value in optionalElementList {
        if let value = value {
            print(value) // "value1", "value2
        }
    }
}
```

Since the list component was required and is now optional, unwrap the optional value to retrieve the value.

**Recommendation:** Update the type in the schema from `[String]` to `[String!]!` to make the list and list component required if you do not store null values in the list or a null list. This will remove the need to unwrap the list and the list components.


</amplify-block>

</amplify-block-switcher>
