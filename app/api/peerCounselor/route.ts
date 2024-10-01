import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
    const { id } = await req.json();
try {
    
    // Validate request body
    if (!id) {
        return NextResponse.json({ message: "Invalid request", status: 400 });
    }

    // Find user by id
    const user = await prisma.peerCounselor.findUnique({
        where: {
            id: id,
        },
    });

    // Check if user exists
    if (!user) {
        return NextResponse.json({ message: "User not found", status: 404 });
    }

    // Return user data
    return NextResponse.json({ user, status: 200 });
}
catch (error:any) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred", 
        status: 500
       });
    }

}



