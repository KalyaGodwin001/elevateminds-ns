"use client"
import Link from "next/link"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { JSX, SVGProps, useEffect, useRef, useState } from "react"
import { ArrowUpRightIcon, ArrowUp, ExternalLink, HeartPulse, LucideFrame, MessageSquareTextIcon, Sparkles, LogOut } from "lucide-react"
import  Resources  from "@/components/addsResources"
import Image from "next/image"
import  Counsellors  from "@/components/Counsellors"
import  PeerCounselor  from "@/components/PeerCounselors"
import Testimonial from "@/components/Testimonial"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
interface TestimonialProps {
  testimonials: {
    id: number;
    name: string;
    description: string;
    rating: number;
  }[];
}

export default function Component() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedTextPosition, setSelectedTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showControlledTooltip, setShowControlledTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialProps["testimonials"]>([]);
  const superUser ="66f672d32c78731bfa03c04f"
const [isSuperUser, setIsSuperUser] = useState(false);
const [superUserId, setSuperUserId] = useState('');
const router = useRouter();
useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    setSuperUserId(userId);
  }
  if (superUser === userId) {
    setIsSuperUser(true);
  }
}
, [
  superUserId,router
]);

const logout = () => {
    
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('roomId');
  localStorage.removeItem('id');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('userId');
  window.location.href = '/';
  toast.success('logged out', {
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
  
};




  useEffect(() => {
    fetchTestimonials().then((data) => {
      setTestimonials(data);
    });
  }
  , []);
  // const handleSelectionChange = () => {
  //   const selection = window.getSelection();
  //   if (selection) {
  //     const selectedText = selection.toString().trim();
     
  //      setTimeout(() => {
  //       setSelectedText(selectedText);
  //       setSelectedTextPosition({ x: selection.getRangeAt(0).getBoundingClientRect().left, y: selection.getRangeAt(0).getBoundingClientRect().top });
  //       setShowControlledTooltip(true);
  //      }
  //       , 1000);
      
  //     console.log('Selected text:', selectedText);
  //   }
  // };

  // const handleSelectionChangeRef = useRef(handleSelectionChange);

  // useEffect(() => {
  //   // Listen for the selectionchange event
  //   document.addEventListener('selectionchange', handleSelectionChangeRef.current);

  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     document.removeEventListener('selectionchange', handleSelectionChangeRef.current);
  //   };
  // }, []); // Empty dependency array ensures this effect runs only once during mount


  const scrollPositionRef = useRef(0);

  useEffect(() => {
    // Save the current scroll position on mount
    scrollPositionRef.current = window.scrollY;

    // Scroll to the saved position after the page has rendered
    window.scrollTo(0, scrollPositionRef.current);

    window.addEventListener('scroll', () => {
      scrollPositionRef.current = window.scrollY;
    }
    );

    return () => {
      window.removeEventListener('scroll', () => {
        scrollPositionRef.current = window.scrollY;
      }
      );
    };
  }, []);

  // fetch testimonials
  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials/getall');
      const data = await response.json();
      if (data.status === 401 || data.status === 400 || data.status === 500) {
        console.error(data.message);
        return;
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const toggleMode = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    localStorage.setItem('username', 'Guest');
  }
  , []);

  const handleClickSection = (section:string,e: { preventDefault: () => void; } | undefined) => {
    e?.preventDefault();
    const nav = document.getElementById('nav');
        if(section === 'home'){
         scrollToSection('home')
          nav?.classList.toggle('hidden');

       }
        if(section === 'resources'){
          scrollToSection('resources')
          nav?.classList.toggle('hidden');
        }
        if(section === 'contact'){
          scrollToSection('contact')
          nav?.classList.toggle('hidden');
        }
        if(section === 'counselor'){
          scrollToSection('counselor')
          nav?.classList.toggle('hidden');
        }
        if(section === 'testimonials'){
          scrollToSection('testimonials')
          nav?.classList.toggle('hidden');
        }
        if(section === 'getStarted'){
          scrollToSection('getStarted')
          nav?.classList.toggle('hidden');
        }
        return

   }
  return (
    <div className="flex flex-col min-h-screen">
      {/* desktop */}
      <header className="sm:flex hidden items-center justify-between bg-transparent
       opacity-90  px-4 py-4 border-b fixed z-50 top-0 inset-x-0
        backdrop-filter backdrop-blur-lg
        dark:bg-neutral-900 dark:border-neutral-800 dark:text-[#f5f5f5]
        border-neutral-100/10 dark:border-neutral-900/10
       ">
        <Link className="flex items-center justify-center" href="#">
         {/* <LucideFrame className="w-8 h-8" />
          */}
            <img
            src="/emns.jpeg"
            alt="logo"
            className="h-12 w-12 mr-2 rounded-full"
          />
          <span className="sr-only">
            Mental Health
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 ">
          <a onClick={handleClickSection.bind(null,'home')} className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 
           
          " href="#">
            <span>Home</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
          </a>
          <a onClick={handleClickSection.bind(null,'resources')} className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " href="#">
            <span>Resources</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
          </a>
          <a onClick={handleClickSection.bind(null,'contact')} className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " href="#">
            <span>Contact</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
          </a>
          <a onClick={handleClickSection.bind(null,'counselor')} className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " href="#">
            <span>Counselors</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
          </a>
          {/* testimonial */}
          <a onClick={handleClickSection.bind(null,'testimonials')} className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " href="#">
            <span>Feedback</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
          </a>
           
          {/* getStarted */}
          <a 
          onClick={handleClickSection.bind(null,'getStarted')}
          className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " >
           
            <span>Get Started</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
            
          </a>
          {
            isSuperUser && (
              <a href="/admin" className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " >
           
            <span>Admin Dashboard</span>
            <ArrowUpRightIcon className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
            </a>
            )
          }
          {
            superUserId && (
              <a onClick={logout} className="text-sm flex flex-row justify-center items-center cursor-pointer group sm:text-lg font-medium hover:transition-all bg-blue-950 ring-1 ring-neutral-50  hover:bg-neutral-500 text-white   capitalize rounded-md  px-3 py-1 hover:underline transition-all duration-500 " >
           
            <span>Logout</span>
            <LogOut className="hidden w-6 h-6 group-hover:inline-block transition-all duration-500" />
            </a>
            )
          }
        </nav>
      </header>
      {/* mobile  */}
      <header className={`sm:hidden flex items-center justify-between 
         px-4 py-4 border-b fixed z-50 top-0 inset-x-0
          ${isOpen ? 'bg-black' : 'backdrop-filter bg-transparent backdrop-blur-lg dark:bg-neutral-900 dark:border-neutral-800 dark:text-[#f5f5f5] border-neutral-100/10 dark:border-neutral-900/10'}
       `}>
        <Link className="flex items-center justify-center" href="#">
          {/* <LucideFrame className="h-8 w-8 mr-2" /> */}
           
          <span className="sr-only">
            Mental Health
          </span>
        </Link>
        <button
          aria-label="Open Menu"
          className="p-2 -mr-2 -mb-2"
          onClick={toggleMode}
        >
         {
          
            isOpen ? (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-black'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            ) : (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-black'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            )
         }
        </button>
      </header>
      {
        isOpen && (<>
          <nav
        id="nav"
        className=" sm:hidden flex flex-col gap-4 items-center justify-center 
        w-full h-screen bg-black  fixed  dark:bg-neutral-800 text-white  top-16 left-0 z-40
        backdrop-filter backdrop-blur-lg
        transition-all duration-500 ease-in-out
        "
      >


        <a onClick={handleClickSection.bind(null,'home')} className="text-lg font-medium hover:underline" href="#">
          Home
        </a>
        <a onClick={handleClickSection.bind(null,'resources')} className="text-lg font-medium hover:underline" href="#">
          Resources
        </a>
        <a onClick={handleClickSection.bind(null,'contact')} className="text-lg font-medium hover:underline" href="#">
          Contact
        </a>
        <a onClick={handleClickSection.bind(null,'counselor')} className="text-lg font-medium hover:underline" href="#">
          Counselors
        </a>
        
        <a 
        onClick={handleClickSection.bind(null,'getStarted')}
        className="text-lg font-medium bg-white hover:bg-gray-100 text-black w-[80%] justify-center flex justify-self-center items-center  rounded-md  px-3 py-2 mx-4 space-x-3 hover:underline transition-all duration-500 " >
          Get Started
        </a>
        {
          isSuperUser && (
            <a href="/admin" className="text-lg font-medium bg-white hover:bg-gray-100 text-black w-[80%] justify-center flex justify-self-center items-center  rounded-md  px-3 py-2 mx-4 space-x-3 hover:underline transition-all duration-500 " >
          Admin Dashboard
        </a>
          )
        }
        {
          superUserId && (
            <a onClick={logout} className="text-lg font-medium bg-white hover:bg-gray-100 text-black w-[80%] justify-center flex justify-self-center items-center  rounded-md  px-3 py-2 mx-4 space-x-3 hover:underline transition-all duration-500 " >
          Logout
        </a>
          )
        }
      </nav>
        </>)
      }
    
      <main className="flex-1 relative">
        <section className="w-full pt-24 dark:bg-neutral-900 
        dark:text-[#f5f5f5] bg-gradient-to-b from-neutral-900 to-neutral-800/none
        bg-opacity-40 dark:bg-opacity-50
        inset-0 
        transition-all duration-300 ease-in-out
        backdrop-filter backdrop-blur-lg
       
         "
         style={
            {
              backgroundImage: "url('./bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -10,
              paddingTop: "0px",
              top: "-3px",


            }
         }
         >
          <div 
          id="home"
          className="container  
          opacity-90  bg-transparent
          backdrop-filter backdrop-blur-lg
          h-[600px] flex items-center justify-center
            dark:text-[#f5f5f5]
             sm:pt-28
       px-4 md:px-6 flex-row">
            <div className="flex flex-col justify-center space-y-4">
              {/* mental health */}
              <h2 className="text-4xl text-center  font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none
               ">
              BETTER MENTAL HEALTH
              </h2>
              <p className="max-w-[600px] text-gray-900 md:text-xl dark:text-gray-600">
                Our team of experienced and compassionate counselors are here to help you navigate life&apos;s
                challenges and find the support you need to live a happy and fulfilling life.
              </p>
            </div>
           
          </div>
        </section>
        {/* get started buttons*/}
        <section
        id="getStarted"
         className="w-full py-16 relative md:py-16 lg:py-20 dark:bg-neutral-900 dark:text-[#f5f5f5]">
          <div className="container bg-grid  flex flex-col gap-y-7 justify-center items-center px-4 md:px-6">
         <Image
          src="grid.svg"
          alt="background"
          width={1572}
          height={1572}
          style={{objectFit: "cover", objectPosition: "center", zIndex: -10, paddingTop: "0px"}}
          className="absolute  top-0 -z-10 text-transparent"
          
        />
       
    
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
              G E T &nbsp; S T A R T E D
            </h2>
            <Card className="w-full flex p-4  flex-col justify-center items-center mx-auto sm:max-w-3xl gap-3">
 <Card className="w-full flex p-4 justify-center items-center mx-auto">
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
              href={'/chat/ai'}
               className="w-full sm:w-auto group shadow-lg shadow-white ring-neutral-900 ring rounded-lg">
                <span className="w-full sm:w-auto flex items-center justify-center   shadow-2xl rounded-md px-6 py-3  bg-gradient-to-r from-pink-500 to-red-500
                bg-clip-text text-transparent font-medium text-lg/none hover:shadow-lg transition-all duration-300 ease-in-out">
                <span >Ai Counselor</span>
                <span><Sparkles className="w-6 h-6 ml-2  animate-pulse
                group-hover:animate-bounce
                text-blue-500
                

                " />
                


                </span>
                </span>
              </Link>
              <a
              onClick={handleClickSection.bind(null,'counselor')}
               className="w-full sm:w-auto cursor-pointer group" >
                <span className="w-full sm:w-auto flex items-center justify-center  bg-neutral-900 shadow-2xl rounded-md px-6 py-3 text-white font-medium text-lg/none hover:shadow-lg transition-all duration-300 ease-in-out">
                  <span>
                  Book Meeting
                  </span>
                  <span>
                    <MessageSquareTextIcon className="w-6 h-6 ml-2
                    group-hover:animate-bounce
                    " />
                  </span>
                </span>
                
              </a>
              
            </div>
            </Card>
            
            <Card className="w-full   max-w-5xl flex p-4 justify-center items-center mx-auto">
            {/* login as a conselor  */}
            <a href="/auth/login" className="text-sm group text-blue-600 hover:underline  hover:text-blue-700 flex flex-row gap-x-2   justify-center items-center italic   no-underline  font-medium  border-s-orange-700 underline-offset-4">
              <span>Login as a Counselor </span>
              <ArrowUpRightIcon  className="w-6 h-6
              group-hover:animate-bounce
              " />
              </a>
              <div className="w-1 h-7 bg-gray-950 mx-4"></div>
              <a href="/peerAuth/login" className="text-sm group text-blue-600 hover:underline  hover:text-blue-700 flex flex-row gap-x-2   justify-center items-center italic     no-underline  font-medium  border-s-orange-700 underline-offset-4">
              <span>Login as a Peer Counselor </span>
              <ArrowUpRightIcon  className="w-6 h-6
              group-hover:animate-bounce
              " />
              </a>
            </Card>
            {
              isSuperUser && (
                <Card className="w-full   max-w-5xl flex p-4 justify-center items-center mx-auto">
                <a href="/admin" className="text-sm group text-blue-600 hover:underline  hover:text-blue-700 flex flex-row gap-x-2   justify-center items-center italic   no-underline  font-medium  border-s-orange-700 underline-offset-4">
              <span>Admin Dashboard </span>
              <ArrowUpRightIcon  className="w-6 h-6
              group-hover:animate-bounce
              " />
              </a>
              </Card>
              )
            }
            </Card>
           
          </div>
        </section>
         
        <section 
        id="counselor"
        className="w-full py-16 md:py-16 lg:py-24">
         <Counsellors />

        </section>
        <section 
        id="peerCounselor"
        className="w-full py-16 md:py-16 lg:py-24">
         <PeerCounselor />

        </section>
        <section 
        id="resources"
        className="w-full  py-16 md:py-16 lg:py-24 dark:bg-neutral-900 dark:text-[#f5f5f5]">
          <Resources />
          </section>
          {/* testimonial */}
          <section
        id="testimonials"
          className="w-full py-16 md:py-16 lg:py-24 dark:bg-neutral-900 dark:text-[#f5f5f5]">

            <div className="container flex flex-col justify-center space-y-4 px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none text-center">
                CLIENT SERVICE FEEDBACK
              </h2>
              <Testimonial
              testimonials={testimonials}
               />
            </div>
            </section>
           
        <section
        id="contact"
         className="w-full py-16 md:py-16 lg:py-24 dark:bg-neutral-900 dark:text-[#f5f5f5]">
          <div className="sm:container flex  sm:flex-row flex-col sm:justify-evenly justify-center mx-auto gap-x-3  gap-y-3 sm:space-x-16 items-center px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                A B O U T &nbsp; U S
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Our priority is to provide the best mental health services to our clients. We are committed to
                helping you navigate life&apos;s challenges and find the support you need to live a happy and
                fulfilling life.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
                C O N T A C T &nbsp; I N F O
              </h3>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                <span className="font-bold">Phone:</span> +254 (112845600)
              </p>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                <span className="font-bold">Email:</span>
                <a className=" hover:text-gray-400 underline underline-offset-2" href="mailto:example@gmail.com">
                  {" "}
                    <span>
                      Mental Health Support
                    </span>
                </a>
              </p>
            </div>
          </div>
          {/* contact */}
          
        </section>
      </main>
      {/* scrolltotop */}
      <a
        onClick={handleClickSection.bind(null,'home')}
        className="fixed bottom-10
        bg-gradient-to-r from-neutral-400 to-neutral-500
        hover:from-neutral-500 hover:to-neutral-400
         shadow-2xl right-4 z-20 flex items-center justify-center w-12 h-12 rounded-full shadow-neutral-700 cursor-pointer dark:bg-neutral-950 dark:text-white hover:shadow-lg transition-all duration-300 ease-in-out"
      >
        <ArrowUp className="w-6 h-6" />
      </a>
     
      
      {/* {
        selectedText  && selectedTextPosition && (
          <div className="fixed bottom-4 flex justify-center items-center z-30 right-4 bg-white w-3/4 mx-auto shadow-lg rounded-md px-4 py-2">
            <p>{selectedText}</p>
          </div>
        )
      } */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 
        M E N T A L &nbsp; H E A L T H. All rights reserved.</p>

        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact Us
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Facebook
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Twitter
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Instagram
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function Health(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m12 8v4l2 2" />
    </svg>
  )
}
