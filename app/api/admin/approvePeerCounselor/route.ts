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


export async function POST(req: Request, res: Response) {

    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

// update counselor where isApproved is false
const unapprovedCounselors = await prisma.peerCounselor.update({
    where: {
        id: id
    },
    data: {
        isApproved: true
    }
});

return NextResponse.json(unapprovedCounselors);





    }
