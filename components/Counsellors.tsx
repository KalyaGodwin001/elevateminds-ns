
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ArrowRight, Loader, RefreshCcw } from "lucide-react";
import crypto from "crypto";
import React from "react";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";



interface Counsellors {
    id: number;
    firstName: string;
    lastName: string;
    message: string;
    profilePicture: string;
    organization: string;
  }
export default function Component() {
  const router = useRouter();
    const token = crypto.randomBytes(20).toString('hex');
    const [loading, setLoading] = useState(false)
    const [isCounselor, setIsCounselor] = useState(false);
  const [counselors, setcounselors] = useState<Counsellors[]>  ([ ]);
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>(null);
  useEffect(() => {
    if (localStorage.getItem('conselor')) {
      setIsCounselor(true);
    }
  }
  , [
    router
  ]);

  // Fetch all counselors - GET /api/counselor/getall
  const fetchCounselors = async () => {
    setLoading(true);
    try {
      let res = await fetch("/api/counselor/getall");
      let data = await res.json();
      if(data.status === 401 || data.status === 400 || data.status === 500){
        console.error(data.message);
        return;
      }
      setcounselors(data.data);
      console.log("counselors", data.data);
      
      setLoading(false);
    } catch (error:any) {
      console.error(error);
      setLoading(false);
    }
  }

  // Fetch all counselors
  React.useEffect(() => {
    fetchCounselors();
  }, [
    router
  ]);



  return (
    <div className=" dark:bg-neutral-950 dark:text-white">
     <h1 className="text-4xl text-center  font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            C O U N S E L O R S
        </h1>
        <p className="text-center">
            Meet our team of professional counselors
        </p>
        {
          loading  &&
           <div className="flex justify-center items-center h-96 flex-col">
            <Loader className="animate-spin" size={50} />
            <span className="ml-3">Loading...</span>
          </div>
        }
        {
          !loading && (<>
          <div className="grid hover:backdrop:blur-lg gap-6 md:grid-cols-2 space-x-2 space-y-2 m-2 xl:grid-cols-4">
       

                {counselors.map((counselor) => (
                    <Card key={counselor.id} className="flex flex-col justify-between
                    hover:shadow-lg transition-all shadow-md shadow-neutral-900 duration-300 ease-in-out
                    hover:scale-105 transform-gpu
                    
                    hover:z-20
                    -translate-y-1
                    -translate-x-1
                    hover:-translate-y-0
                    hover:-translate-x-0
                    group
                    ">

                    <CardHeader>
                       <img 
                       className="rounded-full h-20 w-20
                       hover:backdrop:blur-lg
                       hover:scale-150 transform-gpu
                          hover:z-20
                          cursor-pointer
                            -translate-y-1
                            -translate-x-1
                            rotate-0
                            hover:-translate-y-0
                            hover:-translate-x-0
                            hover:rotate-6
                            transition-all duration-500 ease-in-out
                       "
                       style={{objectFit: "cover"}}
                       src={counselor.profilePicture || `https://ui-avatars.com/api/?background=random&name=${counselor.firstName}+${counselor.lastName}`}
                       alt={counselor.firstName.toLowerCase()} />
                        <CardTitle>{counselor.
                        firstName.toLowerCase()} {counselor.lastName.toLowerCase()
                        }</CardTitle>
                        <CardDescription>{counselor.message.substring(0, 100)}
                        <br />
                        {counselor.message.length > 100 && (
                          <a href={`/counselor/${counselor.id}?token=${token}?counselor=true`}>
                            <span className="underline text-blue-500 cursor-pointer">...Read more</span>
                          </a>
                        )
                        
                        }
                        </CardDescription>
                        <span className=" bg-green-50 hover:bg-green-50 block p-3 rounded-md">Organization     <span className="  px-2 py-1 rounded-lg">{counselor.organization.toUpperCase()}
                        </span></span>
                    </CardHeader>
                    <CardContent>
                      <a href={`/counselor/${counselor.id}?token=${token}?counselor=true`}>
                        <Button className="w-full 
                        flex items-center justify-center
                        " type="submit">
                        <span>
                          {
                            isCounselor ? "View Profile" : "Book Appointment"
                          }
                        </span>
                        <ArrowRight className="h-6 w-6 ml-2 group-hover:animate-bounce" />
                        </Button>
                        </a>
                    </CardContent>
                    </Card>
                ))}


        
     

    </div>
    {
                    counselors.length === 0 && (
                      <div className="flex items-center justify-center flex-col">
                        <p className="text-center">No conselor found</p>
                        <Button onClick={fetchCounselors} className="mt-4">
                          <RefreshCcw size={24} />
                          <span className="ml-2">Retry</span>
                        </Button>
                      </div>
                    )
                }
          </>)
        }
          
    </div>
  
  )
}

