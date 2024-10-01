"use client";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CheckCircleIcon, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Counselor  {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  message: string;
  organization: string;
  location: string;
  startAvailability: string;
  endAvailability: string;
  phone: string;
  selectedSpecializations: string[];
};

export default function Component() {
  const router = useRouter();
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [organization, setOrganization] = useState("");
const [location, setLocation] = useState("");
const [startAvailability, setStartAvailability] = useState("");
const [endAvailability, setEndAvailability] = useState("");
const [phone, setPhone] = useState("");
const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const specializationData = [
  "Counseling",
  "Therapy",
  "Mental Health",
  "Psychology",
  "Psychotherapy",
  "Psychiatry",
  "Social Work"
];

const handleSpecializationClick = (specialization: string) => {
  if (specialization === "Select Specialization") {
    setSelectedSpecializations([]);
  } else if (!selectedSpecializations.includes(specialization)) {
    setSelectedSpecializations((prev) => [...prev, specialization]);
  } else {
    setSelectedSpecializations((prev) => prev.filter((spec) => spec !== specialization));
  }
};
  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Add logic here to handle the form data, such as sending it to a server
    console.log('Form submitted:', { firstName, lastName, email, message, organization, specializationData, location, startAvailability, endAvailability, phone });
   // Add logic here to handle the form data, such as sending it to a server -api/auth/counselor/
    const counselor = { firstName, lastName, email, message, organization, location, startAvailability, endAvailability, phone, selectedSpecializations, password };
    console.log(counselor);

    // Basic validation
    if (!firstName || !lastName || !email || !message || !organization || !location || !startAvailability || !endAvailability || !phone || !selectedSpecializations || !password) {
      // Handle validation errors
      setError("Please fill all the fields");
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);

    fetch("/api/auth/peerCounselor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(counselor),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          toast.success("Counselor created successfully");
          setError("");
          setFirstName("");
          setLastName("");
          setEmail("");
          setMessage("");
          setOrganization("");
          setLocation("");
          setStartAvailability("");
          setEndAvailability("");
          setPhone("");
          setSelectedSpecializations([]);
          setPassword("");
        }

        router.push("/peerAuth/login");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setError("Something went wrong");
        toast.error("Something went wrong");
      });

  };
  return (
    <section className="w-full sm:w-1/2 mx-auto py-12 md:py-24 lg:py-32">
    <Card className="border shadow-lg p-4">
      <CardHeader>
        <CardTitle>Appy As Peer Counselor</CardTitle>
        <CardDescription>
          Please fill all the fields below to apply as a counselor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter your first name" onChange={e => setFirstName(e.target.value)} value={firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter your last name" onChange={e => setLastName(e.target.value)} value={lastName} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" type="email" onChange={e => setEmail(e.target.value)} value={email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Enter your password" type="password" onChange={e => setPassword(e.target.value)} value={password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Who are you?</Label>
            <Textarea className="min-h-[100px]" id="message" placeholder="Tell us about yourself" onChange={e => setMessage(e.target.value)} value={message} />
          </div>
         
          {/* organization */}
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" placeholder="Enter your organization" onChange={e => setOrganization(e.target.value)} value={organization} />
          </div>
          {/* specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            {/* multiple adds */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {specializationData.map((specialization, index) => (
          <a
          style={{cursor: "pointer", textAlign: "center", paddingTop: "8px",paddingBottom: "8px", borderRadius: "8px", border: "1px solid #e5e7eb",
          backgroundColor: selectedSpecializations.includes(specialization) ? "#111827" : "transparent", 
          paddingLeft: "12px", paddingRight: "12px",
          color: selectedSpecializations.includes(specialization) ? "white" : "black"}}
            key={index}
            className={`text-sm flex flex-row justify-center items-center mx-auto ${selectedSpecializations.includes(specialization) ? 'selected text-xs' : ''}`}
            onClick={() => handleSpecializationClick(specialization)}
          >
           <span> {specialization}</span>
           {
              selectedSpecializations.includes(specialization) && (
                <span className="text-xs ml-2">
                  <CheckCircleIcon size={16} />
                </span>
              )
           }
          </a>
        ))}
      </div>
{
    selectedSpecializations.length > 0 && (<>
    <Card className="w-full p-4 mt-4">
      <CardDescription className=" text-center p-2">Selected Specializations</CardDescription>
        {selectedSpecializations.map((specialization, index) => (
          <span key={index} className="inline-block bg-neutral-900 text-white rounded-full px-2 py-1 text-xs font-bold mr-2 mb-2">
            {specialization}
          </span>
        ))}
      </Card>
    </>)
}
      
      {/* end multiple adds */}
              </div>

         
          {/* location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Enter your location" onChange={e => setLocation(e.target.value)} value={location} />
          </div>
          {/* start availability */}
          <div className="space-y-2">
            <Label htmlFor="start-availability">Start Availability</Label>
           
           <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
            id="start-availability" onChange={e => setStartAvailability(e.target.value)} value={startAvailability}>
            <option value="select">Select Start Availability</option>
            <option value="8">8:00 AM</option>
            <option value="9">9:00 AM</option>
            <option value="10">10:00 AM</option>
            <option value="11">11:00 AM</option>
            <option value="12">12:00 PM</option>
            <option value="13">1:00 PM</option>
            <option value="14">2:00 PM</option>
            <option value="15">3:00 PM</option>
            <option value="16">4:00 PM</option>
            <option value="17">5:00 PM</option>
          </select>
          </div>
          {/* end availability */}
          <div className="space-y-2">
            <Label htmlFor="end-availability">End Availability</Label>
            <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
             id="end-availability" onChange={e => setEndAvailability(e.target.value)} value={endAvailability}>
            <option value="select">Select End Availability</option>
            <option value="8">8:00 AM</option>
            <option value="9">9:00 AM</option>
            <option value="10">10:00 AM</option>
            <option value="11">11:00 AM</option>
            <option value="12">12:00 PM</option>
            <option value="13">1:00 PM</option>
            <option value="14">2:00 PM</option>
            <option value="15">3:00 PM</option>
            <option value="16">4:00 PM</option>
            <option value="17">5:00 PM</option>
          </select>
          </div>
          {/* contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter your phone number" onChange={e => setPhone(e.target.value)} value={phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" onChange={e => setEmail(e.target.value)} value={email} />
            </div>
          </div>

        <Button
          disabled={loading}
        className="w-full" type="submit">
         {
            loading ? (<>
          <Loader className="animate-spin h-6 w-6 mr-2" />
            </>) : " Apply As Peer Counselor"
         }
        </Button>

        </form>
        <div className="flex justify-center space-x-2 py-2">
           <p className="">Already a peer counselor?</p>  
            <a href="/peerAuth/login" className="text-blue-600 hover:underline">Login</a>

        </div>
      </CardContent>
     
    </Card>
  </section>
  )
}
