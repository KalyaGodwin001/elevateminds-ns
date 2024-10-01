"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import React, { use, useEffect, useState } from "react"
import { CheckCircle, Edit, Loader2, Verified, VerifiedIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import Uploader from "@/components/uploader";
import { Label } from "@radix-ui/react-label";
import toast from "react-hot-toast";
import RequestCard from "@/components/RequestCard";
import FileUpload from "@/components/FileUploader";
interface UserProfile {
  profile_pic: string | null;
}
interface Request {
  id: string;
  name: string;
  email: string;
  message: string;
  hour: number;
  counselorEmail: string;
  counselorName: string;
  shareMeetingLink: string;
  isAccepted: boolean;
}
type Props = {
    params: {
        id: string;
    }
}

interface Counselor {
    id: string;
   firstName: string;
    lastName: string;
    email: string;
    message: string;
    organization: string;
    location: string;
    startAvailability: string;
    endAvailability: string;
    phone: string;
    selectedSpecializations: string[];
    password: string;
    profilePicture: string;
  }
export default function Component({params}: Props) {
  const router = useRouter();
    const { id } = params;
 const [isLoading, setIsLoading] = React.useState<boolean>(true)
 const [selectedHour, setSelectedHour] = useState<number | null>(null);
 const [isCheckingHour, setIsCheckingHour] = useState(false);
 const [isUpdating, setIsUpdating] = useState(false);
 const [bookingMessage, setBookingMessage] = useState('');
 const [isBooking, setIsBooking] = useState(false);
 const [isBookingSuccess, setIsBookingSuccess] = useState('');
 const [isBookingError, setIsBookingError] = useState('');
 const [isBookingInfo, setIsBookingInfo] = useState(false);
 const [isFetching, setIsFetching] = useState(false);
 const [isCounselor, setIsCounselor] = useState(false);
 const [bookingEmail, setBookingEmail] = useState('');
 const [bookingName, setBookingName] = useState('');
 const [requests, setRequests] = useState<Request[]>([]);
 const [isOpen, setIsOpen] = useState(false)
 const [isShowProfileUpload, setIsShowProfileUpload] = useState(false)
const [isPreviewOpen, setIsPreviewOpen] = useState(false)
const [isUploading, setIsUploading] = useState(false)
const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>('')
const [uploadProgress, setUploadProgress] = useState(0)
const [cloudinaryImgUrl, setCloudinaryImgUrl] = useState('')
const [isUploadingError, setIsUploadingError] = useState(false)
const [isUploadingSuccess, setIsUploadingSuccess] = useState(false)
const [uploadErrorMessage, setUploadErrorMessage] = useState('')
const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')
const [precheckCounselor, setPrecheckCounselor] = useState<boolean>(false)
const [currentCounselorId, setCurrentCounselorId] = useState<string>('')
const [image, setImage] = useState('')
const [picUser, setPicUser] = useState<UserProfile>({
    profile_pic: '',
  })
 const [isFetchingRequests, setIsFetchingRequests] = useState(false);
 const availableHours = Array.from({ length: 10 }, (_, index) => index + 8)
  const [user, setUser] = useState<Counselor>({
    id: "",
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    organization: '',
    location: '',
    startAvailability: '',
    endAvailability: '',
    phone: '',
    selectedSpecializations: [],
    password: '',
    profilePicture: ''
});

const handleZoom = () => {
  setIsOpen(true)
}
const handlePreviewZoom = () => {
  setIsPreviewOpen(true)
}


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
React.useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    setCurrentCounselorId(userId);
  }
}
, [
  router
]);

React.useEffect(() => {
  if (currentCounselorId === id) {
    setPrecheckCounselor(true);
  }
}
, [currentCounselorId]);

React.useEffect(() => {
  if (picUser.profile_pic) {
    setImage(picUser.profile_pic);
  }
  if (previewImg) {
    setImage(previewImg.toString());
  }
}, [picUser.profile_pic, previewImg]);

React.useEffect(() => {
  if (cloudinaryImgUrl) {
    setCloudinaryImgUrl(cloudinaryImgUrl);
  }
}, [cloudinaryImgUrl]);

const uploadOnlyImage = async () => {
  // /api/auth/counselor/upload_profile_pic
  setIsUploading(true);
  const res = await fetch(`/api/auth/counselor/upload_profile_pic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: user.id, profile_pic: cloudinaryImgUrl })
  });

  const data = await res.json();
  console.log(data);

  if (data.status === 200) {
    setIsUploading(false);
    console.log(data.message);
    setTimeout(() => {
      new Audio('/soundplan.wav').play()
      toast.success('Nice profile kudos!', {
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

useEffect(() => {
  if (localStorage.getItem('conselor')) {
    setIsCounselor(true);
  }
  fetchRequests();
}
, [
  router
]);

  //fetching user
  const fetchUser = async () => {
    setIsFetching(true)
    const res = await fetch(`/api/counselor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    console.log(data);

    if (data.status === 200) {
      const user: Counselor = data;
        console.log("user",user);
        
      setUser(data.user);
      console.log(user);
      setIsFetching(false);
    }

    if (
      data.status === 400 ||
      data.status === 500 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 405
    ) {
      setIsFetching(false);
      console.log(data.message);
      toast.error(data.message,{
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    }
  }


   //fetching all requests booked by user
   const fetchRequests = async () => {
    setIsFetchingRequests(true)
    const res = await fetch(`/api/auth/counselor/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    console.log("request",data);

    if (data.status === 200) {
      const requests: Request[] = data.data;
      setRequests(requests);
      console.log(requests);
      setIsFetchingRequests(false);
    }

    if (
      data.status === 400 ||
      data.status === 500 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 405
    ) {
      setIsFetchingRequests(false);
      console.log(data.message);
      toast.error(data.message,{
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    }
  };
  const getMeetingLink = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `https://elevateminds-ns.netlify.app/meeting/${randomString}`;
  }
  useEffect(() => {
    if(selectedHour !== null){
      setIsCheckingHour(true);
  
     // api call to check if the hour is available -api/auth/counselor/bookings/precheck
      const url = `/api/auth/counselor/booking/precheck`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id:id, hour:selectedHour })
      }
      fetch(url,options).then(res => res.json()).then(data => {
        if(data.status === 200){
          setIsCheckingHour(false);
          setIsBookingSuccess(data.message);
         toast.success(`${data.message}`, {
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
          setIsBookingSuccess('');
        }
        , 4000);
        }
        if(data.status === 400 || data.status === 500){
          setIsCheckingHour(false);
          setIsBookingError(data.message);
          toast.error(`${data.message}`, {
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
            setIsBookingError('');
          }
          , 4000);
        }
      }
      ).catch(error => {
        setIsCheckingHour(false);
        setIsBookingError('Something went wrong');
        toast.error('Something went wrong',{
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
        });
      });
    }
  }
  , [
    selectedHour
  ]);

  const handleBooking = async (e: any) => {
    e.preventDefault();
    if(!bookingName || !bookingEmail){
      setIsBooking(false);
      toast.error('Please fill in all fields',{
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
      return;
    }
    // /api/auth/counselor/booking
    setIsBooking(true);
    const res = await fetch(`/api/auth/counselor/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: id,
        name: bookingName,
        email: bookingEmail,
        message: bookingMessage,
        hour: selectedHour,
        counselorId: id,
        counselorEmail: user.email,
        counselorName: user.firstName,
        shareMeetingLink: getMeetingLink()
       })
    });

    const data = await res.json();
    console.log(data);

    if (data.status === 200) {
      setIsBooking(false);
      console.log(data.message);
      setTimeout(() => {
        toast.success(`${data.message}`, {
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
      }, 4000);
    }

    if (
      data.status === 400 ||
      data.status === 500 ||
      data.status === 404 ||
      data.status === 401 ||
      data.status === 405
    ) {
      setIsBooking(false);
      console.log(data.message);
      toast.error(`${data.message}`, {
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
    }
  }
  const handleHourClick = (hour: number ) => {
    if (selectedHour !== hour) {
      setSelectedHour(hour);
       
    } else {
      // If the same hour is clicked again, unselect it
      setSelectedHour(null);
    }
  }

  
  
useEffect(() => {
  setIsLoading(true)
  setTimeout(() => {
    fetchUser();
    // fetchRequests();
    setIsLoading(false)
  }, 3000);
}
, [id,router,params])



  return (
    <>
     {/* go home */}
     <div className="
     flex justify-start items-start p-3

     ">
          <Link href="/" className="text-blue-500
          hover:text-blue-700 cursor-pointer
          ">
            Go Home
          </Link>
          </div>
    {
      isFetching && (
        <div className="min-h-screen flex items-center justify-center ">
          <Loader2 className="w-12 h-12 text-blue-800 animate-spin" />
        </div>
      )
    }
    {
      !isFetching && (
         <section className="dark:bg-neutral-950 dark:text-white py-7 sm:py-12 items-center m-auto  justify-center sm:flex">
   {
        isLoading && (
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-800 animate-spin" />
          </div>
        )
   }
   {
    !isLoading && (<div className={` ${isLoading ? 'hidden rotate-45' : 'block transform rotate-0'}`}>
    <div className="w-full sm:max-w-5xl p-4 md:p-8
    transition-all duration-500 ease-in-out transform 
    
    
    "
    
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 lg:pr-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 overflow-hidden rounded-full flex flex-col justify-start items-start">
              <img
                alt="Image"
                className="bg-gray-200 dark:bg-gray-800"
                height="64"
                src={`${user.profilePicture ? user.profilePicture : `https://ui-avatars.com/api/?background=random&name=${user.firstName}+${user.lastName}`}`}
                style={{
                  aspectRatio: "64/64",
                  objectFit: "cover",
                }}
                width="64"
              />
            
             
            </div>
            <div className="space-y-1">
              
           
              <h1 className="text-2xl font-bold ">
               <span className=" "> {user.firstName} {user.lastName} </span>
              </h1>
               <div className="flex  items-start  flex-row mx-auto justify-start">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Verified
                </span>
                <VerifiedIcon size={20} className=" text-green-500" />
                
              </div>
              <Button size="sm" variant="outline">
                id-{id}
              </Button>
            </div>
            {
              precheckCounselor && (
                <a onClick={() => setIsShowProfileUpload(!isShowProfileUpload)} className="cursor-pointer  flex justify-start items-start gap-x-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Update Profile Pic
                </span>
                <Edit size={20} className="text-black" />
                </a>
              )
            }
           
          </div>
           {/* starts image updates */}
           <Card className={`p-2 ${isShowProfileUpload ? 'bg-green-50' : 'bg-green-100 hidden'}`}>
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
            onClick={handleZoom}
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
                          onClick={handlePreviewZoom}
                          layout="fill"
                          objectFit="contain"
                          className="w-40 h-40 rounded-full ring-4 ring-blue-700 cursor-pointer
                          object-cover object-center
                border-2 border-blue-200 dark:border-blue-800
                transition duration-300 ease-in-out
                  dark:ring-blue-800
                hover:scale-105 hover:rotate-12
                transform hover:shadow-xl
                
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
                previewImg && (<>
                  <Image 
            src={previewImg ? previewImg.toString() : image}
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
                </>)
              }
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
             {
              isShowProfileUpload && (<>
               <Label  className=" my-2" htmlFor="profilePicture">Update Profile Pic</Label>
                  <Input id="profilePicture"
                    onChange={browseImageOnly}
                   placeholder="Upload your picture" type="file"
                    accept="image/*"
                    />
              </>)
             }
    </Card>
              {/* end image updates */}
          <div className="space-y-2">

            <h2 className="text-lg font-semibold">Bio</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.message}
            </p>
          </div>
          <Card className="space-y-2 p-2  bg-green-50">
            <h2 className="text-lg font-semibold">Specialization</h2>
            <ul className="grid gap-2">
              {user.selectedSpecializations.map((specialization) => (
                <li  className="text-sm text-gray-500 dark:text-gray-400 flex justify-start items-start bg-green-300 p-2 rounded-md"
                key={specialization}>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>{specialization}</span>
                  </li>
              ))}
            </ul>
          </Card>
        </div>
       
        <div className="space-y-4 lg:pl-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Organization</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.organization}
            </p>
          </div>
          <Card  className="space-y-2 p-2  bg-green-50">
            <Card className="  p-2 bg-green-300">
            <h2 className="text-lg font-semibold">Availability</h2>
            <div className="grid gap-2 text-sm">
              <div>
                <span>Start: </span>
                <span className="font-semibold"> {user.startAvailability}:00  {Number(user.startAvailability) > 12 ? 'pm' : 'am'}</span>
              </div>
              <div>
                <span>End: </span>
                <span className="font-semibold"> {user.endAvailability}:00 {Number(user.endAvailability) > 12 ? 'pm' : 'am'}</span>
              </div>
             
            </div>
            </Card>
          </Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.location}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email: 
            <a href={`mailto:${user.email}`} className="text-blue-500">
              {user.email}
            </a>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone: 
            <a href={`tel:${user.phone}`} className="text-blue-500">
              {user.phone}
            </a>
            </p>
          </div>
        </div>
      </div>
   
      {
              precheckCounselor && (<>


           <Card className=" my-2 p-2">
            <FileUpload />
           </Card>



              <CardDescription className=" font-extrabold text-2xl justify-center items-center mx-auto flex m-5">
                All Booking Requests
              </CardDescription>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">

                {requests.map((request) => (
                  <RequestCard key={request.id} request={request}
                  conselorId={user.id}
                   />
                ))}
              </div>
              </>)
             }

       {/* book meeting */}
    <Card className=" my-2">
                <Card className="p-2 border border-green-400">
                  <CardHeader>
                <CardTitle>Book Meeting</CardTitle>
                <CardDescription>Book a meeting with your counselor.</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {/*  */}
                  <div>
                  <h2>Select an Hour:</h2>
                  <div className=" space-x-4 sm:flex">
                    {availableHours.map((hour) => (
                      <button
                        key={hour}
                        className={`${
                          selectedHour === hour ? 'bg-black text-white' : 'bg-green-300 shadow shadow-black'
                        } px-4 py-2 my-2 rounded focus:outline-none`}
                        onClick={() => handleHourClick(hour)}
                        disabled={selectedHour !== null && selectedHour !== hour}
                      >
                        from {hour}:00 to {hour + 1}:00
                      </button>
                    ))}
                  </div>
                  <p>Selected Hour: {selectedHour !== null ? `${selectedHour}:00` : 'None'}</p>
                  <Card className="p-2 flex items-center justify-center gap-x-3">
                    {/* deselect  */}
                    {/* TODO */}
                 {
                    selectedHour !== null && (
                      <button
                      className="bg-red-500 text-white px-4 py-2 rounded focus:outline-none flex justify-center items-center flex-1 w-full flex-grow justify-self-center"
                      onClick={() => setSelectedHour(null)}
                      disabled={selectedHour === null}
                    >
                      Deselect
                    </button>
                    )
                 }
                 {
                  selectedHour === null && !isCheckingHour && (
                    <p className="text-green-500">Select an hour to book a meeting</p>

                  )
                 }
                 {
                  isBookingSuccess !== '' && (
                    <p className="text-green-500">{
                      isBookingSuccess 
                    }</p>
                  )
                 }
                 {
                  isBookingError !== '' && (
                    <p className="text-red-500">{isBookingError}</p>
                  )
                 }
                 {/* checking hour availability  */}
                  {
                    isCheckingHour && (
                      <div className="flex p-2 rounded items-center justify-center w-full bg-gray-300 dark:bg-gray-800 animate-pulse">
                        <span className="text-gray-500 p-2 rounded-lg">
                          {
                            isCheckingHour ? 'Checking availabilty...' : 'Checked'
                          }
                        </span>
                      </div>
                    )
                  }

                    
                 </Card>
                </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    type="text"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                    id="message"
                    required
                    placeholder="Enter your message"
                  />
                </div>
                <div className="space-y-2">
                  <Button 
                  onClick={handleBooking}
                  disabled={isCheckingHour || selectedHour === null || isBooking}
                  className="justify-self-center flex justify-center items-center mx-auto w-full">Book 
                    Meeting
                  </Button>
                </div>

              </CardContent>
                </Card>
              
              </Card>
    </div>

   
    </div>)
   }
    
  </section>
      )
    }
    
    </>
   
  )
}

