## Provision backend

Now that you have DataStore persisting data locally, in the next step you'll connect it to the cloud. With a couple of commands, you'll create an AWS AppSync API and configure DataStore to synchronize its data to it.

1. Configure Amplify to manage cloud resources on your behalf. Open a terminal window and run `amplify configure`. This step will configure a new AWS user in your account for Amplify.

    ```bash
    amplify configure
    ```

   This command will open up a web browser to the AWS Management Console and guide you through creating a new IAM user. For step-by-step directions to set this up, refer to the [CLI installation guide](~/cli/start/install.md).

1. Initialize the Amplify backend. To do this, **run the command** and follow the step-by-step instructions:

    ```bash
    amplify init
    ```

1. Next, push your new backend to the cloud. To do this, **run the command**:

    ```bash
    amplify push
    ```
  
  This command will display a summary of the changes that will be pushed to your backend. It should look like this:

  ![](~/images/lib/getting-started/ios/amplify-push-api-summary.png)

  <amplify-callout>

  **Note:** If the summary doesn't contain the API category, you will need to cancel this push process and run `$ amplify add api` before continuing.

  </amplify-callout>

  Select the following options:
  
  - Are you sure you want to continue? `Yes`
  - Do you want to generate code for your newly created GraphQL API? `No`

  <amplify-callout>
    
  **Note:** Sit back and relax since this command will generate all the required cloud resources on your AWS account and it might take a while to complete.
  
  </amplify-callout>

## Enable cloud syncing

In order to enable cloud syncing you need to **configure your application to use the Amplify API category**. Open the main file of the application - `AppDelegate.swift` or `TodoApp.swift` depending on the Life Cycle previously chosen - and **update the amplify initialization code** to add the API plugin. The `application(_,didFinishLaunchingWithOptions:)` function should now call `Amplify.add(plugin:)` with a reference to an `AWSAPIPlugin` instance:
  
```swift
let models = AmplifyModels()
let apiPlugin = AWSAPIPlugin(modelRegistration: models)
let dataStorePlugin = AWSDataStorePlugin(modelRegistration: models)
do {
    try Amplify.add(plugin: apiPlugin)
    try Amplify.add(plugin: dataStorePlugin)
    try Amplify.configure()
    print("Initialized Amplify");
} catch {
    assert(false, "Could not initialize Amplify: \(error)")
}
```

Now when you run you application the data will be synced to your cloud backend automatically! 🎉

## Add a subscription

We will now demonstrate how to add a subscription to the application, so that we can receive any updates to the `Todo` model.

1. Open `ContentView.swift` and **add the following** import statement at the top of the file:
  ```swift
  import Combine
  ```

1. In the same file (`ContentView.swift)`, **add a member variable** in the body of the struct:
  ```swift
  @State var todoSubscription: AnyCancellable?
  ```

1. In the same file (`ContentView.swift`), **add the following** code to the body of the struct:
  ```swift
  func subscribeTodos() {
      self.todoSubscription
          = Amplify.DataStore.publisher(for: Todo.self)
              .sink(receiveCompletion: { completion in
                  print("Subscription has been completed: \(completion)")
              }, receiveValue: { mutationEvent in
                  print("Subscription got this value: \(mutationEvent)")

                  do {
                    let todo = try mutationEvent.decodeModel(as: Todo.self)

                    switch mutationEvent.mutationType {
                    case "create":
                      print("Created: \(todo)")
                    case "update":
                      print("Updated: \(todo)")
                    case "delete":
                      print("Deleted: \(todo)")
                    default:
                      break
                    }

                  } catch {
                    print("Model could not be decoded: \(error)")
                  }
              })
  }
  ```

1. Finally, in the same file (`ContentView.swift`), remove any existing code you may have in the `performOnAppear()` function, and replace it with code **calling the subscribeTodos() function**. Your `performOnAppear()` function may look like this:
  ```swift
  func performOnAppear() {
      subscribeTodos()
  }
  ```

1. **Build and run** the application. In the console output, you will see that we are making a websocket connection to receive updates any time there is a mutation to the Todo model.

Since this is the first time you are connecting to API, DataStore will sync any mutations that were previously made offline. If you have been following the guide, there should be one mutation that is synchronized to the backend that has an id of "Build iOS Application".

## Query for mutations using the console

In this section we will make a mutation using the app sync console and have our app receive that mutation over the websocket subscription.

1. Open a terminal window in your project's directory. **Run the command:**
  ```bash
  amplify console api
  ```
  
  When prompted, select **GraphQL**. This will open the AWS AppSync console.
   ```Console
   ? Please select from one of the below mentioned services: (Use arrow keys)
      GraphQL 
   ```

1. Copy and paste the following query into the left pane:

    ```graphql
    query GetTodos {
        listTodos {
            items {
                id
                name
                description
                _deleted
            }
        }
    }
    ```

1. Press the **play button** to run the query. This will return all of the synchronized Todos in the right pane:

    ![](~/images/lib/getting-started/ios/set-up-ios-appsync-query.png)

## Create a mutation

1. Synchronization will occur bi-directionally. Create an item in AWS AppSync by copying and pasting the following mutation:

    ```graphql
    mutation CreateTodo {
        createTodo(
            input: {
            name: "Tidy up the office",
            description: "Organize books, vacuum, take out the trash",
            priority: NORMAL
            }
        ) {
            id,
            name,
            description,
            priority,
            _version,
            _lastChangedAt,
        }
    }
    ```

    ![](~/images/lib/getting-started/ios/set-up-ios-appsync-create.png)

1. In the console output of your app, you should see:

  ```console
  Subscription got this value: MutationEvent(id: "58220B03-6A42-4EB8-9C07-36019783B1BD", modelId: "0a0acfab-1014-4f25-959e-646a97b7013c", modelName: "Todo", json: "{\"id\":\"0a0acfab-1014-4f25-959e-646a97b7013c\",\"name\":\"Tidy up the office\",\"priority\":\"NORMAL\",\"description\":\"Organize books, vacuum, take out the trash\"}", mutationType: "create", createdAt: 2020-05-14 23:31:04 +0000, version: Optional(1), inProcess: false, graphQLFilterJSON: nil)
  ```
