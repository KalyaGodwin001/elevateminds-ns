
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Download, Loader, RefreshCcw } from "lucide-react";
import Image from "next/image";
import  PdfUploader  from "@/components/pdfdownloader";
import React from "react";


interface Resource {
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
  }
export default function Component() {
    const [resources, setResources] = useState<Resource[]>  ([
       
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
// fetch resources from the server and set the state -GET /api/auth/resources
  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/resources")
      const data = await response.json()
      console.log("data", data.data);
      
      setResources(data.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching resources:", error)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchResources()
  }, [])

  return (
    <>
   
    {
      isLoading && (
        <div className="flex items-center justify-center flex-col">
         <Loader size={50} className="animate-spin" />
         <span className="ml-2">Loading...</span>
        </div>
      )
    }
    {
      !isLoading && (
        <>
         <div className=" dark:bg-neutral-950 dark:text-white bg-grid relative">
      <Image
          src="grid.svg"
          alt="background"
          width={1572}
          height={1572}
          style={{objectFit: "cover", objectPosition: "center", zIndex: -10, paddingTop: "0px"}}
          className="absolute  -top-10 -z-10 text-transparent"
          
        />

     <h1 className="text-4xl text-center  font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            R E S O U R C E S
        </h1>
        <p className="text-center">
            Download and explore the following resources
        </p>
          <div className="grid gap-6 md:grid-cols-2 space-x-2 space-y-2 m-2 xl:grid-cols-4">
       
        {resources.map((resource) => (
           <PdfUploader key={resource.id} resource={resource} />
            ))}

    </div>
    </div>
        </>
      )
    }
    
    {
      !isLoading && resources.length === 0 && (
        <div className="flex items-center justify-center flex-col">
          <p className="text-center">No resources found</p>
          <Button onClick={fetchResources} className="mt-4">
            <RefreshCcw size={24} />
            <span className="ml-2">Retry</span>
          </Button>
        </div>
      )
      
    }
    </>
   
  
  )
}

