// update profile pic
//fetch profile data
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export async function POST(req: Request, res: Response) {
    try {
        if (req.method !== "POST") {
        // return new NextResponse("Method Not Allowed", { status: 405 });
        return NextResponse.json({ message: "Method Not Allowed", 
        status: 405
         });
        }
    
        const { id } = await req.json(); // Assuming only id is sent in the request body
        if (!id) {
        // return new NextResponse("Invalid request", { status: 400 });
        return NextResponse.json({ message: "Invalid request",
            status: 400
            });
        }
    
     //delete resource
        const resources = await prisma.fileResources.delete({
            where: { id },
            select:{
                id:true,
                thumbnail:true
            }
            });
    
            return  NextResponse.json({ message: "ok",
            status: 200,
            user: resources
            });

    }
    catch (error) {
        console.error(error);
        // return new NextResponse("Internal Server Error", { status: 500 });
        return NextResponse.json({ message: "Internal Server Error",
        status: 500
        });
    }


}