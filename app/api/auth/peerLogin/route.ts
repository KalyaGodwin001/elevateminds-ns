import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Import for password hashing
import jwt from "jsonwebtoken"; // Import for JWT token generation
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
  try {
    const data = await req.json();

    // Validate request body
    if (!data) {
      // return new NextResponse("Invalid request", { status: 400 });
      return NextResponse.json({ message: "Invalid request", 
        status: 400
       });
    }

    // Extract email and password from request body
    const { email, password } = data;

    // Find user by email
    const user = await prisma.peerCounselor.findFirst({
        where: {
            email,
            isApproved: true
            
        },
    });

    // Check if user exists and is verified
    if (!user) {
      // return new NextResponse("Invalid email or password", { status: 401 });
      return NextResponse.json({ message: "Invalid email or password", 
        status: 401
       });
    }
    // if(!user.isVerified) {
    //   return NextResponse.json({ message: "User is not verified", 
    //     status: 401
    //    });
    // }

    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // return new NextResponse("Invalid email or password", { status: 401 });
      return NextResponse.json({ message: "Invalid email or password", 
        status: 401
       });
    }

    // Generate JWT token (adapt algorithm and secret as needed)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Set token expiration
    });

    // Return successful response with JWT token
    // return new NextResponse(
    //   JSON.stringify({ token, user: { id: user.id, username: user.username } }),
    // );
    return NextResponse.json({message: "Welcome back", token,user},
       {status: 200}
      );
  } catch (error: any) {
    console.error(error);
    // return new NextResponse(error.message, { status: 500 });
    return NextResponse.json({ message: error.message, 
      status: 500
     });

  }
}