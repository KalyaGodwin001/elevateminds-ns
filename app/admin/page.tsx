"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Arrow } from '@radix-ui/react-tooltip';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// pages/admin/dashboard.js
import { useState, useEffect } from 'react';

interface Testimonial {
    id: string;
    description: string;
    rating: number;
    isApproved: boolean
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
interface PeerCounselor {
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

const Dashboard = () => {
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [peerCounselors, setPeerCounselors] = useState<PeerCounselor[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isUpdatingCounselor, setIsUpdatingCounselor] = useState<boolean>(false);
    const [isUpdatingTestimonial, setIsUpdatingTestimonial] = useState<boolean>(false);
    const [isUpdatingPeerCounselor, setIsUpdatingPeerCounselor] = useState<boolean>(false);
    const superUser ="66f672d32c78731bfa03c04f"
    const router = useRouter();

    useEffect(() => {
      const userId = localStorage.getItem('userId');
      if (userId !== superUser) {
        router.push('/');
      }
    }
    , [router]);

  
    useEffect(() => {
      // Fetch unapproved counselors
      setLoading(true);
      fetch('/api/allCounselors')

        .then(response => response.json())
        .then((data: Counselor[]) => {
          setCounselors(data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching counselors:', error);
        });

        // Fetch unapproved peer counselors
      fetch('/api/allPeerCounselors')
       .then(response => response.json())
        .then((data: PeerCounselor[]) => {
          setPeerCounselors(data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching peer counselors:', error);
        });
  
      // Fetch unapproved testimonials
      fetch('/api/admin/unapprovedTestimonials')
        .then(response => response.json())
        .then((data: Testimonial[]) => {
          setTestimonials(data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching testimonials:', error);
        });
  
    }, []); // Empty dependency array to run the effect only once
  
    const approveCounselor = async (counselorId: string) => {
      setIsUpdatingCounselor(true);
      try {
        // Update approval for counselor
        await fetch(`/api/admin/approveCounselor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: counselorId })
        });
        // Update local state after approval
        setCounselors(prevCounselors => prevCounselors.filter(c => c.id !== counselorId));
        setIsUpdatingCounselor(false);
      } catch (error) {
        console.error('Error approving counselor:', error);
        setIsUpdatingCounselor(false);
      }
    };

    const approvePeerCounselor = async (counselorId: string) => {
      setIsUpdatingPeerCounselor(true);
      try {
        // Update approval for counselor
        await fetch(`/api/admin/approvePeerCounselor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: counselorId })
        });
        // Update local state after approval
        setPeerCounselors(prevCounselors => prevCounselors.filter(c => c.id !== counselorId));
        setIsUpdatingPeerCounselor(false);
      } catch (error) {
        console.error('Error approving counselor:', error);
        setIsUpdatingPeerCounselor(false);
      }
    }
    
    const approveTestimonial = async (testimonialId: string) => {
      setIsUpdatingTestimonial (true);
      try {
        // Update approval for testimonial
        await fetch(`/api/admin/approveTestimonial`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: testimonialId })
        });
        // Update local state after approval
        setTestimonials(prevTestimonials => prevTestimonials.filter(t => t.id !== testimonialId));
        setIsUpdatingTestimonial(false);
      } catch (error) {
        console.error('Error approving testimonial:', error);
        setIsUpdatingTestimonial(false);
      }
    };
    
  
    if (loading) {
      return <>
       <div className="flex justify-center items-center h-screen z-20 fixed inset-0">
       <Loader2 className="animate-spin h-10 w-10 text-gray-900" />
      </div>
      </>
    }
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          {/* go home */}
          <div className="flex justify-center items-center"></div>
            <Button
              className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Card className="p-4 m-4">

           
        <div className="mb-8">
        
          {
            isUpdatingCounselor && <p className=' text-center'>Approving counselor...</p>
          }
          {
            isUpdatingTestimonial && <p className=' text-center'>Approving testimonial...</p>
          }
          <h2 className="text-xl font-bold mb-4">Unapproved Counselors</h2>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border">Name</th>
                <th className="border">Action</th>
              </tr>
            </thead>
            <tbody>
              {counselors.map(counselor => (
                <tr key={counselor.id}>
                  <td className="border p-2">{counselor.firstName + " " + counselor.lastName} </td>
                  <td className="border p-2">
                    <Button
                    disabled={isUpdatingCounselor}
                      className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                      onClick={() => approveCounselor(counselor.id)}
                    >
                    
                     Approve
                    
                    </Button>
                  </td>
                </tr>
              ))}
              {
                counselors.length === 0 && <tr><td colSpan={2} className="border p-2 text-center">No unapproved counselors</td></tr>
              }
            </tbody>
          </table>
        </div>

        <div className="mb-8">
        
        {
          isUpdatingPeerCounselor && <p className=' text-center'>Approving peer counselor...</p>
        }
        <h2 className="text-xl font-bold mb-4">Unapproved Peer Counselors</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border">Name</th>
              <th className="border">Action</th>
            </tr>
          </thead>
          <tbody>
            {peerCounselors.map(counselor => (
              <tr key={counselor.id}>
                <td className="border p-2">{counselor.firstName + " " + counselor.lastName} </td>
                <td className="border p-2">
                  <Button
                  disabled={isUpdatingPeerCounselor}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                    onClick={() => approvePeerCounselor(counselor.id)}
                  >
                  
                   Approve
                  
                  </Button>
                </td>
              </tr>
            ))}
            {
              peerCounselors.length === 0 && <tr><td colSpan={2} className="border p-2 text-center">No unapproved peer counselors</td></tr>
            }
          </tbody>
        </table>
      </div>

  
        <div>
          <h2 className="text-xl font-bold mb-4">Unapproved Testimonials</h2>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border">Content</th>
                <th className="border">Action</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(testimonial => (
                <tr key={testimonial.id}>
                  <td className="border p-2">{testimonial.description}</td>
                  <td className="border p-2">
                    <Button
                      className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                      onClick={() => approveTestimonial(testimonial.id)}
                    >
                      
                    Approve
                      
                      
                    </Button>
                  </td>
                </tr>
              ))}
              {
                testimonials.length === 0 && <tr><td colSpan={2} className="border p-2 text-center">No unapproved testimonials</td></tr>
              }
            </tbody>
          </table>
        </div>
        </Card>
      </div>
    );
  };
  
  export default Dashboard;