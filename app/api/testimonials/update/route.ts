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
        
     
        // update isApproved to true
        const updatedTestimonial = await prisma.testimonial.updateMany({
            where: {
                isApproved: false,
            },
            data: {
                isApproved: true,
            },
        });
        // Return all testimonials
        return NextResponse.json({ data: updatedTestimonial, status: 200 });
}
catch (error:any) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred", 
        status: 500
       });
    }

}



