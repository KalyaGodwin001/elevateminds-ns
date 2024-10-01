
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
//TemplateID:  d-20c6e30370374c6ca63b6f0179ccf14a
import sendgrid from "@sendgrid/mail";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
// book counselor
export async function POST(req: Request, res: Response) {
    if(!process.env.SENDGRID_API_KEY) {
        console.log("SENDGRID_API_KEY is not set");
        
        return  NextResponse.json({ message: "Invalid request", 
        status: 400
       });
      }
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
    const user = await prisma.peerCounselor.findUnique({
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
    const existingBooking = await prisma.peerMeeting.findFirst({
      where: {
        peerCounselorId: data.id,
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
    const booking = await prisma.peerMeeting.create({
        data: {
            name: data.name,
            email: data.email,
            message: data.message,
            hour: parseInt(data.hour),
            peerCounselorId: data.id,
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


    const mail = {
        to: user.email,
        subject: 'New Booking',
        from: 'francismwanik254@gmail.com', // Fill it with your validated email on SendGrid account
        dynamicTemplateData: {
            name: user.firstName,
            email: user.email,
            message: data.message,
            counselorId: data.id,
            hour: data.hour + ":00" + "-" + (parseInt(data.hour) + 1) + ":00",
            shareMeetingLink: data.shareMeetingLink,
            counselorName: `${user.firstName} ${user.lastName}`,
            counselorEmail: user.email,
        },
        templateId: 'd-02f228bbf32e4eacac163c274f27c920',
      };
        try {
          await sendgrid.send(mail);
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