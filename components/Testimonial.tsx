// components/Testimonial.tsx

import { Loader, Star } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
interface TestimonialProps {
  testimonials: {
    id: number;
    name: string;
    description: string;
    rating: number;
  }[];
}

const Testimonial = ({ testimonials }: TestimonialProps) => {
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    description: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewTestimonial((prevTestimonial) => ({
      ...prevTestimonial,
      [name]: value,
    }));
  };

  const handleRatingChange = (newRating: number) => {
    setNewTestimonial((prevTestimonial) => ({
      ...prevTestimonial,
      rating: newRating,
    }));
  };

  const handleAddTestimonial = async () => {
        if(newTestimonial.name === '' || newTestimonial.description === '' || newTestimonial.rating === 0){
          return;
        }
    setLoading(true);
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTestimonial.name,
          description: newTestimonial.description,
          rating: newTestimonial.rating,
        }),
      });
      // You can also update the UI with the new testimonial from the response
      const data = await response.json();
      console.log('Testimonial added:', data);
      setLoading(false);
      setNewTestimonial({
        name: '',
        description: '',
        rating: 0,
      });
      toast.success('Testimonial Will be added after approval');

      setTimeout(() => {
        window.location.reload();
      }
      , 2000);
    } catch (error) {
      setLoading(false);
      console.error('Error submitting testimonial:', error);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Display existing testimonials  max 6 tesmonials*/}
        {testimonials.slice(0, 6).map((testimonial) => (
          <Card key={testimonial.id} className="border p-4 rounded-md">
            <p className="font-semibold">{testimonial.name}</p>
            <p>{testimonial.description}</p>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))} 
              </div>
          </Card>
        ))}

      
      </div>
      <div className="p-4 mt-8 justify-center items-center flex mx-auto">
      {
          testimonials.length === 0 && (
            <div className="col-span-3">
              <p className="text-center">No testimonials available</p>
            </div>
          )
        }
      </div>

      {/* Form for adding new testimonial */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Add Your Feedback</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newTestimonial.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Testimonial
            </label>
            <textarea
              id="description"
              name="description"
              value={newTestimonial.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rate Us</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl ${
                    star <= newTestimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                  } focus:outline-none`}
                >
                  {star <= newTestimonial.rating ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                  
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="button"
            disabled={loading}
            onClick={handleAddTestimonial}
            
          >
          {
            loading ? (
              <Loader className='animate-spin' size={20} />
            ) : '  Submit Feedback'
          }
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Testimonial;
