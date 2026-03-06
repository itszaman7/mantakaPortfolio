"use server";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function submitContactForm(formData: ContactFormData) {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim() || "General Inquiry";
    const message = formData.message.trim();

    // Validate required fields
    if (!name || !email || !message) {
        return { success: false, error: "Please fill in all required fields." };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, error: "Please enter a valid email address." };
    }

    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey || apiKey === 're_xxxxxxxxx') {
            console.error("❌ Resend API Key is missing or invalid in .env.local");
        }
        const resend = new Resend(apiKey);
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // 1. Save to Supabase
        const { error } = await supabase.from("contact_messages").insert({
            name,
            email,
            subject,
            message,
        });

        if (error) {
            console.error("Supabase insert error:", error);
            return {
                success: false,
                error: "Failed to send message. Please try again later.",
            };
        }

        // 2. Send email notification via Resend
        try {
            const { data, error: emailError } = await resend.emails.send({
                from: "Portfolio Contact <onboarding@resend.dev>",
                to: "mantaka35@gmail.com",
                replyTo: email, // This allows you to just click "Reply" in your email
                subject: `💬 New Contact: ${subject} — from ${name}`,
                html: `
                    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                        <div style="border-bottom: 3px solid #FF2800; padding-bottom: 16px; margin-bottom: 24px;">
                            <h2 style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 22px;">New Contact Form Submission</h2>
                            <p style="color: #999; margin: 0; font-size: 13px;">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
                        </div>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                            <tr>
                                <td style="padding: 12px 0; color: #999; font-size: 13px; width: 90px; vertical-align: top;">Name</td>
                                <td style="padding: 12px 0; font-weight: 600; font-size: 15px; color: #1a1a1a;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #999; font-size: 13px; vertical-align: top;">Email</td>
                                <td style="padding: 12px 0; font-size: 15px;">
                                    <a href="mailto:${email}" style="color: #FF2800; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #999; font-size: 13px; vertical-align: top;">Subject</td>
                                <td style="padding: 12px 0; font-size: 15px; color: #1a1a1a;">${subject}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-bottom: 24px;">
                            <h3 style="color: #1a1a1a; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
                            <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #FF2800; font-size: 15px; line-height: 1.7; color: #333; white-space: pre-wrap;">${message}</div>
                        </div>
                        
                        <div style="border-top: 1px solid #eee; padding-top: 16px;">
                            <p style="font-size: 12px; color: #999;">You can reply directly to this email to contact the sender.</p>
                        </div>
                    </div>
                `,
            });

            if (emailError) {
                console.error("❌ Resend API Error:", emailError);
            } else {
                console.log("✅ Email sent successfully via Resend:", data?.id);
            }
        } catch (err) {
            console.error("❌ Resend Network/Library Error:", err);
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("Contact form submission error:", err);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}
