// initiatePasswordReset.ts

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
import nodemailer from 'nodemailer';
export const dynamic = "force-dynamic";
export async function POST(req: Request, res: Response) {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  try {
    if (req.method !== "POST") {
      // return new NextResponse("Method Not Allowed", { status: 405 });
      return NextResponse.json({ message: "Method Not Allowed", 
      status: 405
     });
    }
    let transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'wearsworks@gmail.com', // Add your username here
          pass: 'AYcB4Sy65MJEDzsF', // Use your master password here
        },
      });

    const { email } = await req.json(); // Assuming only email is sent in the request body
    if (!email) {
      // return new NextResponse("Invalid request", { status: 400 });
      return NextResponse.json({ message: "Invalid request",
        status: 400
        });
    }

    // Find user by email
    const user = await prisma.counselor.findUnique({
      where: { email },
    });

    if (!user) {
      // return new NextResponse("User not found", { status: 404 });
      return NextResponse.json({ message: "User not found",
        status: 404
        });
    }

    // Generate a unique reset token
    const resetToken = randomBytes(32).toString("hex");

    // Update user's reset token in the database
    await prisma.counselor.update({
      where: { id: user.id },
      data: { resetToken: resetToken,
       resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
     },
    });

    // Send an email to the user with a link containing the reset token
    const mail = {
        from: '"WearsWorks 👻" <wearsworks@gmail.com>', // sender address
        to: email,
        subject: 'Reset Password',
        html: `
          <p>Click this <a href="${BASE_URL}/auth/Updatepassword/${resetToken}">link</a> to reset your password.</p>
          
        `,
        };
        transporter.sendMail(mail, (error, data) => {
            if (error) {
                console.log(error);
                // return new NextResponse("Error sending email", { status: 500 });
                return NextResponse.json({ message: "Error sending email",
                  status: 500
                  });
            } else {
                console.log('Email sent: ' + data.response);
            }
        });

    // return new NextResponse("Password reset initiated successfully!", { status: 200 });
    return NextResponse.json({ message: "Password reset initiated successfully!",
      status: 200
      });
  } catch (error: any) {
    console.error(error);
    // return new NextResponse(error.message, { status: 500 });
    return NextResponse.json({ message: error.message,
      status: 500
      });
  }
}