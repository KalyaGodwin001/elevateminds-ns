import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export async function POST(req: Request, res: Response) {
    try {
        if (req.method !== "POST") {
            return NextResponse.json({
                message: "Method Not Allowed",
                status: 405,
            });
        }

        const {
            asset_id,
            bytes,
            format,
            height,
            original_filename,
            pages,
            placeholder,
            public_id,
            resource_type,
            secure_url,
        } = await req.json();
        if (!asset_id) {
            return NextResponse.json({
                message: "Invalid request",
                status: 400,
            });
        }

        // Check if the asset already exists
        const existingAsset = await prisma.fileResources.findUnique({
            where: {
                public_id: public_id,
            },
        });

        if (existingAsset) {
            return NextResponse.json({
                message: "Asset already exists",
                status: 400,
            });
        }

        // Create the asset
        const asset = await prisma.fileResources.create({
            data: {
                asset_id,
                bytes,
                format,
                height,
                original_filename,
                pages,
                placeholder,
                public_id,
                resource_type,
                secure_url,
            },
        });

        return NextResponse.json({
            message: "File uploaded successfully",
            status: 200,
            asset,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Internal Server Error",
            status: 500,
        });
    }
}
