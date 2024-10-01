import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Download, Edit, Loader, Trash2Icon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { useRouter } from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import toast from 'react-hot-toast';
import { Input } from './ui/input';
import Uploader from './uploader';
interface UserProfile {
  profile_pic: string | null;
}
interface CardProps {
    resource: {
        id: string;
        asset_id: string;
        bytes: number;
        format: string;
        height: number;
        original_filename: string;
        pages: number;
        placeholder: boolean;
        public_id: string;
        resource_type: string;
        secure_url: string;
        thumbnail: string;
    };
}
const YourComponent: React.FC<CardProps> = ({ resource }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [isShowProfileUpload, setIsShowProfileUpload] = useState(false)
 const [isPreviewOpen, setIsPreviewOpen] = useState(false)
 const [isUploading, setIsUploading] = useState(false)
 const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>('')
 const [uploadProgress, setUploadProgress] = useState(0)
 const [cloudinaryImgUrl, setCloudinaryImgUrl] = useState('')
 const [isDeleting, setIsDeleting] = useState(false)
 const [isUploadingError, setIsUploadingError] = useState(false)
 const [isUploadingSuccess, setIsUploadingSuccess] = useState(false)
 const [uploadErrorMessage, setUploadErrorMessage] = useState('')
 const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')
 const [image, setImage] = useState('https://images.pexels.com/photos/5302897/pexels-photo-5302897.jpeg?auto=compress&cs=tinysrgb&w=600')
 const [picUser, setPicUser] = useState<UserProfile>({
     profile_pic: '',
   })
  const [isCounselor, setIsCounselor] = useState(false);

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    // Save the current scroll position on mount
    scrollPositionRef.current = window.scrollY;

    // Scroll to the saved position after the page has rendered
    window.scrollTo(0, scrollPositionRef.current);
  }, []);

  React.useEffect(() => {
    if (cloudinaryImgUrl) {
      setCloudinaryImgUrl(cloudinaryImgUrl);
    }
  }, [cloudinaryImgUrl]);
  const uploadOnlyImage = async () => {
    // /api/auth/counselor/upload_profile_pic
    setIsUploading(true);
    const res = await fetch(`/api/resources/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: resource.id, profile_pic: cloudinaryImgUrl })
    });
  
    const data = await res.json();
    console.log(data);
  
    if (data.status === 200) {
      setIsUploading(false);
      console.log(data.message);
      setTimeout(() => {
        toast.success('Succeded kudos!', {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          duration: 4000,
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
          
        });
        setTimeout(() => {
          window.location.reload();
        }
        , 600)
      }, 4000);
    }
  
    if (
      data.status === 400 ||
      data.status === 500 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 405
    ) {
      setIsUploading(false);
      console.log(data.message);
    }
  }

  const deleteResource = async (id: string) => {
    setIsDeleting(true);
    const res = await fetch(`/api/resources/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
  
    const data = await res.json();
    console.log(data);
  
    if (data.status === 200) {
      console.log(data.message);
      setIsDeleting(false);
      setTimeout(() => {
        toast.success('Succeded kudos!', {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          duration: 4000,
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
          
        });
        setTimeout(() => {
          window.location.reload();
        }
        , 600)
      }, 4000);
    }
  
    if (
      data.status === 400 ||
      data.status === 500 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 405
    ) {
      console.log(data.message);
      setIsDeleting(false);
    }
  }


  const handleUploadSuccess = (uploadedUrl: string) => {
    setCloudinaryImgUrl(uploadedUrl);
    setIsUploadingSuccess(true);
    toast.success('successfully converted', {
      style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#713200',
      },
      duration: 4000,
      iconTheme: {
        primary: '#713200',
        secondary: '#FFFAEE',
      },
      
    });
    setTimeout(() => {
      setIsUploadingSuccess(false);
      setUploadSuccessMessage('');
    }, 3000);
  };
  const browseImageOnly = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImg(reader.result)
      }
      reader.readAsDataURL(file)
    }
    }

  useEffect(() => {
    if (localStorage.getItem('conselor')) {
      setIsCounselor(true);
    }
  }
  , [
    router
  ]);
  const fileKey = 'your_file_key'; // replace with your actual file key

//   const handleDownloadClick = async () => {
//     try {
//       const filePath = await downloadFromCloudinary(fileKey);
//       const downloadLink = document.createElement('a');
//       downloadLink.href = filePath;
//       downloadLink.download = `${fileKey}.pdf`;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   const downloadFromCloudinary = async (file_key: string) => {
//     const url = `https://res.cloudinary.com/dunssu2gi/image/upload/${file_key}.pdf`;

//     const response = await axios({
//       url,
//       method: 'GET',
//       responseType: 'arraybuffer',
//     });

//     const buffer = Buffer.from(response.data, 'binary');
//     fs.writeFileSync(`${file_key}.pdf`, buffer);

//     return `${file_key}.pdf`;
//   };

  return (
    <div>
       <Card 
            className="hover:shadow-lg transition-all shadow-md shadow-neutral-900 duration-300 ease-in-out
            hover:scale-105 transform-gpu
            space-x-2 space-y-2 m-2
            
            hover:z-20
            -translate-y-1
            -translate-x-1
            hover:-translate-y-0
            hover:-translate-x-0"
            key={resource.id}>
                  <img
                 className="w-full h-48 object-cover rounded-t-lg
                 "
                src={resource.thumbnail ? resource.thumbnail : image}
                 alt={resource.original_filename} />
                       {/* starts image updates */}
           <Card className={`p-2 ${isShowProfileUpload ? ' bg-white' : ' bg-white hidden'}`}>
       {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl h-full overflow-hidden">
            <button
              className="absolute top-0 right-0 z-50 flex items-center justify-center w-10 h-10 text-2xl font-bold text-white bg-gray-900 rounded-full"
              onClick={() => setIsOpen(false)}
            >
             <X className=" h-7 text-white" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={picUser.profile_pic ? picUser.profile_pic : image}
                alt=""
                layout="fill"
                objectFit="contain"
                className="w-full h-full"
              />
              {
                 /* fetching image skeleton */
                !picUser.profile_pic && (
                  <div className="absolute  inset-0 flex items-center justify-center w-full h-full bg-gray-500 animate-pulse"></div>
                )
              }
            </div>
          </div>
        </div>
      )}
      {/* dialog for image on zoom */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="relative w-full max-w-3xl h-full overflow-hidden">
          <button
            className="absolute top-0 right-0 z-50 flex items-center justify-center w-10 h-10 text-2xl font-bold text-white bg-gray-900 rounded-full"
            onClick={() => setIsPreviewOpen(false)}
          >
           <X className=" h-7 text-white" />
          </button>
          <div className="relative w-full h-full">
          <Image
                src={previewImg ? previewImg.toString() : image}
                alt=""
                layout="fill"
                objectFit="contain"
                className="w-full h-full"
              />
           
          </div>
        </div>
                <Image 
            src={picUser.profile_pic ? picUser.profile_pic : image}
            alt="" 
            width={100} height={100}
           
            className=" w-32 h-32 rounded-full 
            object-cover object-center
            p-2
            border-2 border-blue-100 dark:border-blue-100
            transition duration-300 ease-in-out
            
            hover:scale-105 hover:rotate-12
            transform hover:shadow-xl
            cursor-pointer"
        />
          
          <div className="space-y-2">
                  {
                    /* is uploading */
                    isUploading && (
                      /* loading progress */
                      <div className="flex items-center justify-center w-full h-10 bg-gray-300 dark:bg-gray-800 animate-pulse">
                        <span className="text-gray-500">{uploadProgress}%</span>
                      </div>
                    )
                  }
                  {
                    /* is uploading error */
                    isUploadingError && (
                      <span className="text-red-500">{uploadErrorMessage}</span>
                    )
                  }
                  {
                    /* is uploading success */
                    isUploadingSuccess && (
                      <span className="text-green-500">{uploadSuccessMessage}</span>
                    )
                  }
                  {
                    /* preview */
                    previewImg && (
                      <div className="relative w-40 mx-auto h-40">
                        <Image
                          src={previewImg.toString()}
                          alt=""
                          
                          layout="fill"
                          objectFit="contain"
                          className="w-full h-48 object-cover rounded-t-lg
                
                          "
                        />
                      </div>
                    )
                  }
            
                 
                </div>
      </div>
       
      )}
 <CardFooter>
                {
                  previewImg && (
                   <Uploader previewImg={previewImg}  onUploadSuccess={handleUploadSuccess}/>
                  )
                }
              </CardFooter>
             {
              cloudinaryImgUrl && (<>
                <CardFooter>

                {
                  previewImg && (
                    <div className="flex gap-x-3">
                      <Button className="ml-auto"
                  onClick={uploadOnlyImage}
                  disabled={isUploading}
                
                >
                  { isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                {/* remove */}
                <Button className="ml-auto"
                onClick={() => {
                  setPreviewImg(null);
                  
                }
                }
                >
                  Remove
                </Button>
                    </div>
                  )
                }
              </CardFooter>
              </>)
             }
            
             {
              isShowProfileUpload && (<>
               <Label  className=" my-2 " htmlFor="profilePicture">Update Profile Pic</Label>
                  <Input id="profilePicture"
                  className='bg-white w-full'
                    onChange={browseImageOnly}
                   placeholder="Upload your picture" type="file"
                    accept="image/*"
                    />
              </>)
             }
    </Card>
              {/* end image updates */}
                  {

                    isCounselor && (
                      <button onClick={()=>setIsShowProfileUpload(!isShowProfileUpload)} className="w-full bg-transparent border-none shadow-none  text-gray-500flex justify-center items-center mx-auto  justify-self-center  my-3 flex-row flex " >
                      <span>
                          Edit image
                      </span>
                      <Edit className="group-hover:animate-bounce w-6 h-6 ml-2" />
                    </button>
                    )
                    }
                <CardHeader>
                <CardTitle>{resource.original_filename. length > 20 ? resource.original_filename.substring(0, 20) + '...' : resource.original_filename}
                </CardTitle>
                </CardHeader>
                <CardContent className='flex justify-center items-center  mx-auto'>
                <CardContent className='flex justify-center items-center  mx-auto gap-x-1'><span>format</span> <span>{resource.format}</span></CardContent>
                <CardContent className='flex justify-center items-center  mx-auto gap-1'><span>size </span><span>{
                resource ? resource.bytes / 1000 : 0
                }</span><span> kb</span>
                </CardContent>
                </CardContent>
               
             
                <CardFooter>
                  <a   className='flex justify-center items-center  mx-auto gap-1'
                  >

<a 
               
               href={resource.secure_url} target="_blank">
              <Button className="w-full
              flex items-center justify-center
              group
              " type="submit">
                  <span>
                      Download
                  </span>
                  <Download className="group-hover:animate-bounce w-6 h-6 ml-2" />
              </Button>
             
              </a>
{
                  isCounselor && (
                    <Button
                    disabled={isDeleting}
                    onClick={() => {
                      deleteResource(resource.id);
                    }
                    }
                     className="w-full
                    flex bg-red-600 items-center justify-center
                    group
                    " type="submit">
                        <span>
                            {
                              isDeleting ? (<Loader className='animate-spin' />) : 'Delete'
                            }
                        </span>
                        <Trash2Icon className="group-hover:animate-bounce w-6 h-6 ml-2" />
                    </Button>
                  )

                }
                  </a>
              
                </CardFooter>
            </Card>
    </div>
  );
};

export default YourComponent;
