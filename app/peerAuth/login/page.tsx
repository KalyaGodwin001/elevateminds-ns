"use client";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useState } from "react"
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();
    const [token, setToken] = useState("");
    const [Password, setPassword] = useState("");
    const [email, setEmail] = useState("");
   const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
  
      // Basic validation
      if ( !Password || !email) {
        // Handle validation errors
        console.error("Validation failed");
        return;
      }
      setLoading(true);
      setError("");

      try {
        let res =await fetch("/api/auth/peerLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password: Password }),
        })
        let data = await res.json();
        if(data.status === 401 || data.status === 400 || data.status === 500){
          setError(data.message);
          setLoading(false);
          toast.error(data.message);
          return;
        }
       
          setLoading(false);
          const token = crypto.randomUUID();
           let counselor = "true";
          toast.success(data.message);
          localStorage.setItem("token", data.token);
          localStorage.setItem("currentUser", JSON.stringify(data.user.firstName + " " + data.user.lastName));
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("conselor", 'true');
          localStorage.setItem("counselorName", data.user.firstName + " " + data.user.lastName);
         window.location.href = `/peerCounselor/${data.user.id}?token=${token}?counselor=${counselor}`;

          
      
      } catch (error:any) {
        console.error(error);
        setError("An error occurred");
        setLoading(false);
        toast.error("An error occurred");
        
      }
        
    };
  return (
    <section className="w-full sm:w-1/2 mx-auto py-12 md:py-24 lg:py-32">
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1">
        <span className="text-red-600 py-3 flex justify-center items-center mx-auto">{error}</span>
        <div className="flex items-center">
          <KeyIcon className="h-6 w-6 mr-2" />
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </div>
        
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="new-password"> Password</Label>
            <Input id="new-password" placeholder="Enter password" required type="password" onChange={e => setPassword(e.target.value)} value={Password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
                Email
            </Label>
            <Input id="email" placeholder="Email..." required type="email" onChange={e => setEmail(e.target.value)} value={email} />
          </div>
          <Button 
          disabled={loading}
          className="w-full" type="submit">
           {
              loading ? (<>
               <Loader className="animate-spin h-5 w-5 mr-3" />
              </>): " Login"
           }
          </Button>
        </form>
        <div className="flex justify-center space-x-2 py-2">
            <a href="/auth/peerAuth/ResetPassword" className="text-blue-600 hover:underline">Forgot Password?</a> 
            <a href="/peerAuth/register" className="text-blue-600 hover:underline">Apply as Peer Counselor</a>
        </div>


      </CardContent>
    </Card>
    </section>
  )
}

function KeyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}
