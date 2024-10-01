import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // Import for password hashing
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    const  { id } = await req.json(); 

    console.log("id",id);
    

    const data = await prisma.counselor.findMany({
        where:{
            id: id
        },
        select:{
         meetings:true
        }
    })


    console.log("data",data[0].meetings);
    
     

    if (data.length === 0) {
      return NextResponse.json({ message: "No meeting found", status: 404 });
    }

    return NextResponse.json({ data: data[0].meetings
      , status: 200 });


  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}