import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { quote, recipient } = await req.json();

    if (!quote || !recipient) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // SMTP Host
      port: Number(process.env.MAIL_PORT), // Convert to number
      secure: process.env.MAIL_ENCRYPTION === "ssl", // SSL check
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: recipient,
      subject: "Your Quote",
      text: quote,
      html: `<p>${quote.replace(/\n/g, "<br>")}</p>`,
    });

    return NextResponse.json({
      success: true,
      message: "Quote sent successfully!",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
