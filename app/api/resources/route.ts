/* 
 asset_id: data.asset_id,
            bytes: data.bytes,
            format: data.format,
            height: data.height,
            original_filename: data.original_filename,
            pages: data.pages,
            placeholder: data.placeholder,
            public_id: data.public_id,
            resource_type: data.resource_type,
            secure_url: data.secure_url
*/
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export async function GET(req: Request, res: Response) {
    try {
       
        // Get all resources
        const resources = await prisma.fileResources.findMany({});

        console.log("resources-----", resources);

        return NextResponse.json({
            message: "ok",
            status: 200,
            data: resources
        });
        
    
        
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error",
        status: 500
        });
    }

}