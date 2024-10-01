
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useState } from "react"

export default function Component() {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault();
  
      // Basic validation
      if (!token || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
        // Handle validation errors
        console.error("Validation failed");
        return;
      }
  
      // Perform password update logic here
      console.log("Password update logic");
    };
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <KeyIcon className="h-6 w-6 mr-2" />
          <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
        </div>
        <CardDescription>Enter your token, new password and confirm it below</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <Input id="token" placeholder="Enter your token" required type="text" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" placeholder="Enter new password" required type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" placeholder="Confirm new password" required type="password" />
          </div>
          <Button className="w-full" type="submit">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
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
