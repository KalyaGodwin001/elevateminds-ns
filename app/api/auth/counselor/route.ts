import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import bcrypt from "bcryptjs"; 
const prisma = new PrismaClient();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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


export async function POST(req: Request, res: Response) {
    const {
        firstName,
        lastName,
        email,
        message,
        organization,
        location,
        startAvailability,
        endAvailability,
        phone,
        selectedSpecializations,
        password
    } = await req.json() as Counselor;


    const counselorExists = await prisma.counselor.findFirst({
        where: {
            email: email
        }
    });

    if(counselorExists) {
        return NextResponse.json({error: "Counselor already exists"}, {status: 400});
    }
    
    const getRandomString = (length: number) => {
        return crypto.randomBytes(length).toString('hex');

    }

    const hashedpassword = await bcrypt.hash(password, 10);

    
    const counselor = await prisma.counselor.create({
        data: {
        firstName,
        lastName,
        email,
        message,
        organization,
        location,
        startAvailability,
        endAvailability,
        phone,
        selectedSpecializations:selectedSpecializations,
        password:hashedpassword,
        profilePicture: "https://ui-avatars.com/api/?name=" + firstName + "+" + lastName + "&background=random&color=fff",
        },
    });
    

    if(!counselor) {
        return NextResponse.json({error: "Counselor not created"}, {status: 400});
    }

    return NextResponse.json({message: "Counselor created successfully"}, {status: 200});


    }
