import sendEmail from "@/lib/sendEmail";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, recaptchaToken } = await req.json();

    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (
      name.length > 50 ||
      email.length > 50 ||
      phone.length > 20 ||
      message.length > 1000
    ) {
      return NextResponse.json({ error: "Field too long" }, { status: 400 });
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" },
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400 });
    }

    const emailContent = `
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #fff;
          padding: 20px !important;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .header {
          font-size: 24px;
          font-weight: bold;
        }
        .header img {
          height: 40px;
          width: auto;
        }
        .header p {
          margin-top: 10px;
        }
        p {
          margin-top: 20px;
          margin-bottom: 0;
        }
        .content strong {
          color: #2c3e50;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Det har kommet en henvendelse fra Appkoms hjemmeside</p>
          <p><strong>Fullt navn:</strong> ${name}</p>
          <p><strong>Telefonnummer:</strong> ${phone}</p>
          <p><strong>Melding:</strong></p>
          <p>${message}</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      await sendEmail({
        toEmails: ["appkom@online.ntnu.no"],
        subject: `Ny henvendelse fra ${name}`,
        htmlContent: emailContent,
      });
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }

    return NextResponse.json({ emailContent }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 },
    );
  }
}
