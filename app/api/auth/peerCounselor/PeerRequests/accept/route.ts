import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
//TemplateID:  d-20c6e30370374c6ca63b6f0179ccf14a
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
export async function POST(req: Request, res: Response) {

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
    const data = await prisma.peerMeeting.update({
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
            counselorId: data.peerCounselorId + " " + isAccepted ? "Accepted" : "Declined",
            hour: data.hour + ":00" + "-" + (parseInt(hour) + 1) + ":00",
            shareMeetingLink: shareMeetingLink,
            counselorName: counselorName,
            counselorEmail: counselorEmail,
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
    return NextResponse.json({ message: "Meeting accepted successfully. Email sent to the user.", status: 200 });

   
  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}