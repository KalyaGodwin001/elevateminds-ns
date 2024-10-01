"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useState } from "react"
import { Loader2 } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function Component() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleResetEmail = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        setLoading(true)

        if(email === ''){
            toast.error(`No email please`, {
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
              setLoading(false)
              return
        }

        //email regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailRegex.test(email)){
            toast.error(`Please enter a valid email`, {
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
              setLoading(false)
              return
        }
        try {
            
            let res = await fetch('/api/auth/peerResetPassword ', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
              })
              let response = await res.json()
              if(response.status === 200){
                setLoading(false)
                setEmail('')
                toast.success(`Password reset instructions sent to ${email}`, {
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
                setLoading(false)
                setEmail('')  
                setTimeout(() => {
                    window.location.href = '/peerAuth/login'
                }
                , 3000)
              }
              if(response.status === 404 || response.status === 400 ||  response.status === 401 || response.status === 405 || response.status === 500){
                setLoading(false)
                toast.error(`${response.message}`, {
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
                 setLoading(false)
              }

        } catch (error:any) {
            setLoading(false)
            toast.error(error.message, {
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
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <Card className="mx-auto max-w-md ">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <KeyIcon className="h-6 w-6 mr-2" />
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        </div>
        <CardDescription>Enter your email below to receive password reset instructions</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4"
        onSubmit={handleResetEmail}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email"
             onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com" required type="email" />
          </div>
          <Button
           disabled={loading}
           className="w-full" type="submit">
          {
            loading ? (<>
             <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing</span>
            </>) : 'send Instructions'
          }
          </Button>
        </form>
      </CardContent>
    </Card>
    <Toaster />
    </div>
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