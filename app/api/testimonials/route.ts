import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
interface testimonial{
    name: string;
    description: string;
    rating: number;

}
const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
    const { name, description, rating } = await req.json();
try {
        
        // Validate request body
        if (!name || !description || !rating) {
            return NextResponse.json({ message: "Invalid request", status: 400 });
        }
    
        // Create new testimonial
        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                description,
                rating,
                isApproved: false,
            },
        });

        // Return new testimonial data
        return NextResponse.json({ testimonial, status: 200 });
}
catch (error:any) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred", 
        status: 500
       });
    }

}



