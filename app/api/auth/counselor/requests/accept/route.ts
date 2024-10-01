import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import nodemailer from 'nodemailer';
const prisma = new PrismaClient();
//TemplateID:  d-20c6e30370374c6ca63b6f0179ccf14a
export const dynamic = "force-dynamic";
export async function POST(req: Request, res: Response) {

  let transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'wearsworks@gmail.com', // Add your username here
      pass: 'AYcB4Sy65MJEDzsF', // Use your master password here
    },
  });
  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    const  { id,name,
        email,
        message,
        hour,
        counselorEmail,
        counselorName,
        shareMeetingLink,
        isAccepted } = await req.json(); 

    console.log("id",id);
    //update the request -isAccepted
    const data = await prisma.meeting.update({
        where:{
            id: id
        },
        data:{
            isAccepted: true
        }
    })

    console.log("data",data);

    if (!data) {
      return NextResponse.json({ message: "No meeting found", status: 404 });
    }

    const mail = {
        to: email,
        subject: 'Booking Accepted',
        from: 'francismwanik254@gmail.com', // Fill it with your validated email on SendGrid account
        dynamicTemplateData: {
            name: name,
            email: email,
            message: message,
            counselorId: data.counselorId + " " + isAccepted ? "Accepted" : "Declined",
            hour: data.hour + ":00" + "-" + (parseInt(hour) + 1) + ":00",
            shareMeetingLink: shareMeetingLink,
            counselorName: counselorName,
            counselorEmail: counselorEmail,
        },
        templateId: 'd-02f228bbf32e4eacac163c274f27c920',
      };
        try {
          let info = await transporter.sendMail({
            from: '"WearsWorks 👻" <wearsworks@gmail.com>', // sender address
              to: email, // list of receivers
                subject: 'New Booking', // Subject line
                text: 'Hello world?', // plain text body
                //white background color for the email and black for the text
                html: ` 
                <body style="font-family: 'Inter', sans-serif; padding: 20px; background-color: #fff; color: #000;">
                <h1 style="color: #000;">New Booking</h1>
                <h2>Dear ${name},</h2>
                <p>You have a new booking from ${counselorEmail} at ${data.hour}:00-${parseInt(hour) + 1}:00</p>
                <p>Message: ${data.message}</p>
                <p>Share Meeting Link: ${data.shareMeetingLink}</p>


      
      
                <p>Thank you for using our service!</p>
      
                <p>Bookers Team</p>
                `
              });
          console.log("email sent");
          
        } catch (error: any) {
          console.error(error);
          if (error.message) {
            console.log(error.message);
            
            return  NextResponse.json({ message: error.message,
              status: 500
             });
          }

          
        }
    return NextResponse.json({ message: "Meeting accepted successfully. Email sent to the user.", status: 200 });

   
  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}