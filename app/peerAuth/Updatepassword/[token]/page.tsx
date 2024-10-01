"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

type  Props = {
  params: {
    token: string
  }
}

export default function Component ({ params: { token } }: Props) {
 const router = useRouter()
 const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')

  const updatePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const body = {
      token: token,
      email: email,
      password: newPassword,
    }
   
    setLoading(true)
    if(newPassword !== confirmPassword){
     toast.error(`Passwords do not match`, {
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
    if(newPassword.length < 8){
      toast.error(`Password must be at least 8 characters`, {
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
    if(!token){
      toast.error(`Token is required`, {
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
    if(!email){
      toast.error(`Email is required`, {
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
    const res = await fetch('/api/peerAuth/peerUpdatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    //status 400
    if (data.status === 400 || data.status === 401 || data.status === 500) {
      toast.error(`${data.message}`, {
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
    //status 200
    if (data.status === 200) {
      new Audio('/soundplan.wav').play()
      toast.success(`Password updated successfully`, {
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
      setTimeout(() => {
        router.push('/auth/login')
      }
      , 2000)
      return
    }
  
  }

  return (
    <div  className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <KeyIcon className="h-6 w-6 mr-2" />
          <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
        </div>
        <CardDescription>Enter your new password and confirm it below</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4"
        onSubmit={updatePassword}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email" required type="email" />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" 
            onChange={(e) => setNewPassword(e.target.value)}

            placeholder="Enter new password" required type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" 
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password" required type="password" />
          </div>
          <Button
          disabled={loading}  
           className="w-full" type="submit">
              {
            loading ? (<>
             <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing</span>
            </>) : 'Update Password'
          }
          </Button>
        </form>
      </CardContent>
    </Card>
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