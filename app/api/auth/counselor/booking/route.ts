
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
//TemplateID:  d-20c6e30370374c6ca63b6f0179ccf14a
// import sendgrid from "@sendgrid/mail";
import nodemailer from 'nodemailer';
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
// book counselor
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
    const data = await req.json();
    console.log("data",data);
    

    // Validate request body
    if (!data) {
      return NextResponse.json({
        message: "Invalid request",
        status: 400,
      });
    }

    

    //check if the counselor exists
    const user = await prisma.counselor.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      return NextResponse.json({
        message: "counselor not found",
        status: 404,
      });
    }


    //see if the counselor is available by checking if the selected hour is in the counselor's available hours
    const availableHours = user.startAvailability + "-" + user.endAvailability;
    const availableHoursArray = availableHours.split("-");
    const startHour = parseInt(availableHoursArray[0]);
    const endHour = parseInt(availableHoursArray[1]);
    const selectedHourInt = parseInt(data.hour);
    if (selectedHourInt < startHour || selectedHourInt > endHour) {
      return NextResponse.json({
        message: "counselor is not available at this hour",
        status: 400,
      });
    }

    //check if the hour is already booked
    const existingBooking = await prisma.meeting.findFirst({
      where: {
        counselorId: data.id,
        hour: parseInt(data.hour),
      },
    });

    if (existingBooking) {
      return NextResponse.json({
        message: "counselor is already booked at this hour",
        status: 400,
      });
    }

        // Get the current date and time
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        // Reset hour to 0 every 24 hours
        if (currentHour >= 24) {
        data.hour = "0";
        }




    // Create booking
    const booking = await prisma.meeting.create({
        data: {
            name: data.name,
            email: data.email,
            message: data.message,
            hour: parseInt(data.hour),
            counselorId: data.id,
            counselorEmail: user.email,
            counselorName: `${user.firstName} ${user.lastName}`,
            shareMeetingLink: data.shareMeetingLink,
        },
    });

    if (!booking) {
        return NextResponse.json({
            message: "Booking failed",
            status: 500,
        });
    }



        try {
          let info = await transporter.sendMail({
            from: '"WearsWorks 👻" <wearsworks@gmail.com>', // sender address
              to: user.email, // list of receivers
                subject: 'New Booking', // Subject line
                text: 'Hello world?', // plain text body
                //white background color for the email and black for the text
                html: ` 
                <body style="font-family: 'Inter', sans-serif; padding: 20px; background-color: #fff; color: #000;">
                <h1 style="color: #000;">New Booking</h1>
                <h2>Dear ${user.firstName},</h2>
                <p>You have a new booking from ${data.name} at ${data.hour}:00-${parseInt(data.hour) + 1}:00</p>
                <p>Message: ${data.message}</p>
                <p>Share Meeting Link: ${data.shareMeetingLink}</p>


      
      
                <p>Thank you for using our service!</p>
      
                <p>Bookers Team</p>
                `
              });
        
              console.log('Message sent: %s', info);
              // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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


          
      return NextResponse.json({
        message: "Booking successful",
        status: 200,
        data: booking,
      });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
}