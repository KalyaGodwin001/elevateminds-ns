import { PrismaClient } from "@prisma/client";
import bycrypt from "bcryptjs";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();
const saltRounds = 10; // Adjust the number of salt rounds as needed

export async function POST(req: Request, res: Response) {
  try {
    const { token, password,email } = await req.json(); // Assuming the token and newPassword are sent in the request body

    // Find user with matching token
    const user = await prisma.counselor.findUnique({
      where: {
         resetToken: token,
        email:email
         },
    });

    if (!user) {
      // return new NextResponse("Invalid verification token", { status: 400 });
      return NextResponse.json({ message: "Invalid verification token", 
      status: 401
     });
    }
     // Check if the reset token has expired
     if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
        // return new NextResponse("Reset token has expired", { status: 400 });
        return NextResponse.json({ message: "Reset token has expired",
        status: 401
        });
      }

    // Hash the new password
    const hashedPassword = await bycrypt.hash(password, saltRounds);

    // Update user's password and clear reset token
    await prisma.counselor.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: undefined, resetTokenExpiry: undefined },
    });

    // return new NextResponse("Password updated successfully!", { status: 200 });
    return NextResponse.json({ message: "Password updated successfully!",
    status: 200
    });
  } catch (error:any) {
    console.error(error);
    // return new NextResponse(error.message, { status: 500 });
    return NextResponse.json({ message: error.message,
      status: 500
      });
  }
}

// Function to validate the token from the database
async function isValidToken(token: string,email:string): Promise<boolean> {
  // Check the token in the database and return true if valid, false otherwise
  const user = await prisma.counselor.findUnique({
    where: { 
        resetToken: token,
        email:email
     },
  });

  // You can add additional checks like token expiration here if needed
  return !!user; // Return true if the user is found with the provided token, false otherwise
}