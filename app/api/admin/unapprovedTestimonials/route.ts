import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs"; 
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

interface Counselor {
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
}


export async function GET(req: Request, res: Response) {

// FETCH counselor where approved is false
const unapprovedTestimonials = await prisma.testimonial.findMany({
    where: {
        isApproved: false
    }
});

return NextResponse.json(unapprovedTestimonials);





    }
