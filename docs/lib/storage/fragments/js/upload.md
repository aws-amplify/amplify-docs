## Put
The `Put` method uploads files into Amazon S3.

It returns a `{key: S3 Object key}` object on success:

```javascript
const result = await Storage.put('test.txt', 'Hello');
```

### Public level

```javascript
const result = await Storage.put('test.txt', 'Hello');
```

### Protected level

```javascript
const result = await Storage.put('test.txt', 'Protected Content', {
    level: 'protected',
    contentType: 'text/plain'
});
```

### Private level

```javascript
const result = await Storage.put('test.txt', 'Private Content', {
    level: 'private',
    contentType: 'text/plain'
});
```

### Monitor progress of upload

To track the progress of your upload, you can use the ```progressCallback```: 

```javascript
Storage.put('test.txt', 'File content', {
    progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
  },
});
```
### Encrypted uploads

To utilize Server-Side Encryption with AWS KMS, the following options can be passed in with the Put API like so:

```javascript
const serverSideEncryption = AES256 | aws:kms;
const SSECustomerAlgorithm = 'string';
const SSECustomerKey = new Buffer('...') || 'string';
const SSECustomerKeyMD5 = 'string';
const SSEKMSKeyId = 'string';

const result = await Storage.put('test.txt', 'File content', {
    serverSideEncryption, SSECustomerAlgorithm, SSECustomerKey, SSECustomerKeyMD5, SSEKMSKeyId
});
```

Other options available are:

```javascript
Storage.put('test.txt', 'My Content', {
    acl: 'public-read', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    cacheControl: 'no-cache', // (String) Specifies caching behavior along the request/reply chain
    contentDisposition: 'attachment', // (String) Specifies presentational information for the object
    expires: new Date().now() + 60 * 60 * 24 * 7, // (Date) The date and time at which the object is no longer cacheable. ISO-8601 string, or a UNIX timestamp in seconds
    metadata: { key: 'value' }, // (map<String>) A map of metadata to store with the object in S3.
})
```

## Browser uploads
Upload an image in the browser:

```javascript
async function onChange(e) {
  const file = e.target.files[0];
  try {
    await Storage.put(file.name, file, {
      contentType: 'image/png' // contentType is optional
    });
  } catch (error) {
    console.log('Error uploading file: ', error);
  }  
}

<input
  type="file"
  onChange={onChange}
/>
```

## React Native uploads
Upload an image in your React Native app:

```javascript
async function pathToImageFile(data) {
      try {
        const response = await fetch(data);
        const blob = await response.blob();
        await Storage.put(`your key here`, blob, {
          contentType: 'image/jpeg', // contentType is optional
        });
      } catch (err) {
        console.log('Error uploading file:', err);
      }
    }
    pathToImageFile(result.uri);
  }
```


## React Native upload images with Expo Image Picker
Expo Image Picker is a commonly used image library for React Native. Combined with S3 it is a powerful tool for any workflow. Make sure you set up your Auth and Storage, then copy the code below:

```javascript
import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify, { Storage } from 'aws-amplify'
import config from './src/aws-exports'
// import awsconfig from './aws-exports';
// Might need to switch line 7 to awsconfig 
Amplify.configure(config)

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet, Text, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

function App() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState('Evan Erickson')

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result) 
    async function pathToImageFile(data) {
      try {
        const response = await fetch(data);
        const blob = await response.blob();
        await Storage.put(`customers/${name}`, blob, {
          contentType: 'image/jpeg', // contentType is optional
        });
      } catch (err) {
        console.log('Error uploading file:', err);
      }
    }
    pathToImageFile(result.uri);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App)
```


When a networking error happens during the upload, Storage module retries upload for a maximum of 4 attempts. If the upload fails after all retries, you will get an error.
