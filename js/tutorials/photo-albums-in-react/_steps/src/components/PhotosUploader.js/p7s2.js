import { API, Auth, Predictions, Storage } from 'aws-amplify';
import nanoid from 'nanoid';
import React, { createRef, useState } from 'react';
import { Button } from 'semantic-ui-react';

import { createPhoto } from '../graphql/mutations';
import awsconfig from '../aws-exports';
import useAuth from '../useAuth';

const loadImage = file => {
  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
      URL.revokeObjectURL(image.src);
    };

    image.src = URL.createObjectURL(file);
  });
};

export default function PhotosUploader({ album }) {
  const { owner } = useAuth();
  const inputRef = createRef();
  const [isUploading, setIsUploading] = useState(false);

  if (!owner) {
    return null;
  }

  const handleChange = async event => {
    setIsUploading(true);

    const files = [...event.target.files];
    const user = await Auth.currentAuthenticatedUser();

    await Promise.all(
      files.map(async file => {
        const source = { file };
        const type = 'LABELS';

        // ! Even though Storage.put works, the lambda trigger
        // ! will get AccessDenied errors when accessing S3 files
        // ! with special characters: https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html
        const s3SafeName = `${nanoid()}-${file.name}`.replace(/[^\w.-]/g, '');

        const [labels, { key }] = await Promise.all([
          // Normalize & keep labels with higher confidence
          Predictions.identify({
            labels: { source, type }
          })
            .then(payload => {
              return payload.labels
                .filter(label => label.metadata.confidence >= 70)
                .map(label => label.name.toLowerCase());
            })
            .catch(error => {
              // In case there are any 504 gateway errors, don't block uploading
              console.error(error);
              return [];
            }),

          Storage.put(s3SafeName, file, {
            metadata: {
              albumId: album.id,
              owner: user.username
            }
          })
        ]);

        const { width, height } = await loadImage(file);

        try {
          await API.graphql({
            authMode: owner ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
            query: createPhoto,
            variables: {
              input: {
                bucket: awsconfig.aws_user_files_s3_bucket,
                fullsize: {
                  key,
                  width,
                  height
                },
                photoAlbumId: album.id,
                labels,
                description: file.name.replace(/\.(gif|jpg|jpeg|png)$/i, '')
              }
            }
          });
        } catch (payload) {
          throw new Error(payload.errors[0].message);
        }
      })
    );

    setIsUploading(false);
  };

  return (
    <>
      <Button
        content="Add Photos"
        disabled={isUploading}
        floated="right"
        icon="file image outline"
        loading={isUploading}
        onClick={() => inputRef.current.click()}
        secondary
        type="button"
      />

      <input
        accept="image/*"
        hidden
        multiple
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
    </>
  );
}
