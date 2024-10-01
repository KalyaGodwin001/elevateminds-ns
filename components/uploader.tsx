import React, { useEffect, useState } from 'react';

interface YourComponentProps {
     previewImg: string | ArrayBuffer | null
     onUploadSuccess: (uploadedUrl: string) => void;
    }



const YourComponent = ({ previewImg ,onUploadSuccess}: YourComponentProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingError, setIsUploadingError] = useState(false);
  const [isUploadingSuccess, setIsUploadingSuccess] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  useEffect(() => {
    if(previewImg) {
        uploadFile(previewImg);
        }
    }, [previewImg]);

  const uploadFile = async (file: string | ArrayBuffer  ) => {
    setIsUploading(true);
    setUploadProgress(0);
    setIsUploadingError(false);
    setIsUploadingSuccess(false);

    const cloudName = 'dzvtkbjhc'; // Replace with your Cloudinary cloud name
    const unsignedUploadPreset = 'c5gngmqw'; // Replace with your Cloudinary unsigned upload preset

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();

    formData.append('upload_preset', unsignedUploadPreset);
    formData.append('tags', 'browser_upload');
   
  // Convert the file parameter to a Blob
  const blobFile = file instanceof ArrayBuffer ? new Blob([file]) : file;

  formData.append('file', blobFile);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    try {
      xhr.open('POST', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const uploadedUrl = data.secure_url;
            console.log('Uploaded to Cloudinary:', uploadedUrl);
            onUploadSuccess(uploadedUrl);
            setUploadSuccessMessage('Image uploaded successfully.');
            setIsUploadingSuccess(true);
            setIsUploading(false);
          } else {
            console.error('Failed to upload:', xhr.statusText);
            setUploadErrorMessage('Failed to upload image.');
            setIsUploadingError(true);
            setIsUploading(false);
          }
        }
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading:', error);
      setUploadErrorMessage('Error uploading image.');
      setIsUploadingError(true);
      setIsUploading(false);
    }
  };

  // Add your JSX rendering logic here

  return (
    <div>
      {isUploading && (
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between gap-x-2">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                In Progress please wait...
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {uploadProgress}%
              </span>
            </div>
          </div>
          <div className="flex mb-2 items-center justify-between">
            <div className="flex flex-col">
              <div className="w-full bg-gray-800 text-white rounded-full">
                <div
                  className="text-xs leading-none py-1 text-center text-white bg-teal-500 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Your component JSX */}
    </div>
  );
};

export default YourComponent;