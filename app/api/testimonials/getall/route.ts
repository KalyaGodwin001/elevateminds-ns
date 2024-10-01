import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
interface testimonial{
    name: string;
    description: string;
    rating: number;

}
const prisma = new PrismaClient();

export async function GET(req: Request, res: Response) {
try {
        
     
        // Get all testimonials and shuffle them
        const testimonials = await prisma.testimonial.findMany({
            where: {
                isApproved: true,
            },
            select: {
                id: true,
                name: true,
                description: true,
                rating: true,
            },
            orderBy: {
                id: 'desc',
            },
        });
       
        // Return all testimonials
        return NextResponse.json({ data: testimonials, status: 200 });
}
catch (error:any) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred", 
        status: 500
       });
    }

}



