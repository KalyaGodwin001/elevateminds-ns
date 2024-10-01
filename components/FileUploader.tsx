"use client";
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react'
import {useDropzone} from "react-dropzone"
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { Card } from './ui/card';
type Props = {}
interface CloudinaryAsset {
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
  };
  

const FileUpload = () => {
    const router = useRouter();
    const [file, setFile] = React.useState<File | null>(null)
    const [uploading, setUploading] = React.useState<boolean>(false)
    const [file_name, setFileName] = React.useState<string>("")
    const [file_key, setFileKey] = React.useState<string>("")
     const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
     const [isLoading, setIsLoading] = React.useState<boolean>(false)
    // cloudName: "dunssu2gi",
    //       uploadPreset: "zao6hc4d",
    const {getRootProps, getInputProps} = useDropzone(
        {
            accept: { "application/pdf": [".pdf"] },
            maxFiles: 1,
            onDrop: async (acceptedFiles:any) => {
                setUploading(true)
                const file = acceptedFiles[0]
                if(!file) {
                    toast.error("Please upload a correct file")
                    return
                }
                if(file?.size > 10 * 1024 * 1024) {
                    toast.error("Please upload a file smaller than 10MB")
                

                    return
                }
                if(file?.type !== "application/pdf") {
                    toast.error("Please upload a PDF file")
                    return
                }
                try {

                    setFile(acceptedFiles[0])
                    console.log(file);
                    
                    setTimeout(() => {
                        setUploading(false)
                    }
                    , 1000)

                    
                
                } catch (error) {
                    console.log(error);
                    toast.error("Something went wrong")
                    setUploading(false)
                    
                }
            }
        }
    )
    const handleCloudinaryUpload = async (file: string | Blob) => {
       if(file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "zao6hc4d")
        const res = await fetch("https://api.cloudinary.com/v1_1/dunssu2gi/upload", {
            method: "POST",
            body: formData
        })
        const data = await res.json()
        console.log(data);
        setUploadedFile(data)
        setFileKey(data.public_id)
        setFileName(data.original_filename)

        // api call to save the file to the database - interface CloudinaryAsset POST /api/upload
        const response = await axios.post<CloudinaryAsset>("/api/uploadpdf", {
            asset_id: data.asset_id,
            bytes: data.bytes,
            format: data.format,
            height: data.height,
            original_filename: data.original_filename,
            pages: data.pages,
            placeholder: data.placeholder,
            public_id: data.public_id,
            resource_type: data.resource_type,
            secure_url: data.secure_url
        })
        const resData = response.data
        if(resData) {
            toast.success("File uploaded successfully")
            router.push("/")
        }
        
        console.log("resData", resData);


        
                    
        if(!data) {
            toast.error("Something went wrong")
            return
        }
        
 
      
       }

    }
    React.useEffect(() => {
        if (file) {
            handleCloudinaryUpload(file)
        }
    }, [file])

  return (
    <Card className="p-2 bg-white rounded-xl my-4">

    <div className="p-2 bg-white rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800">Upload PDF (Resources)</h3>
        <div {...getRootProps()}
            className="w-full h-32 flex justify-center items-center border-2 border-gray-300 border-dashed rounded-xl cursor-pointer flex-col"
            suppressHydrationWarning
        >
            <input {...getInputProps()} />
            { uploading || isLoading ? (
                <>
                <Loader2 className="w-12 h-12 text-blue-800 animate-spin" />
                <p className="text-gray-500 text-sm px-1 mt-2">
                    Uploading file please wait...
                    </p>
                </>
            ):(
                 <><Inbox className="w-12 h-12 text-gray-400" /><span
                          className="text-gray-500 text-sm px-1"
                      >Drag &apos;n&apos; drop some files here, or click to select files</span></>
            )}
           
            </div>
            </div>
            </Card>
    
  )
}

export default FileUpload