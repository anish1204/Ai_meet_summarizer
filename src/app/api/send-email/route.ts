import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !html) {
      return NextResponse.json(
        { error: 'Recipient and summary content are required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT ?? 587),
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: subject || 'Meeting Summary',
      html,
    });

    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Failed to send email' },
      { status: 500 }
    );
  }
}
