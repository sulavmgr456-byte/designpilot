import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, rating, message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    // Build the email body
    const emailBody = [
      `📬 New Feedback from DesignPilot AI`,
      ``,
      `Name: ${name || "Anonymous"}`,
      `Email: ${email || "Not provided"}`,
      `Rating: ${"⭐".repeat(rating || 0)} (${rating || "N/A"}/5)`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    if (accessKey) {
      // Use Web3Forms API to send email
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `DesignPilot AI Feedback — ${rating ? rating + "⭐" : "No rating"}`,
          from_name: name || "Anonymous User",
          reply_to: email || "noreply@designpilot.ai",
          message: emailBody,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Web3Forms error:", data);
        return NextResponse.json(
          { success: false, error: "Failed to send feedback." },
          { status: 500 }
        );
      }
    } else {
      // Fallback: log to console if no API key configured
      console.log("=== FEEDBACK RECEIVED (no email API key) ===");
      console.log(emailBody);
      console.log("============================================");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
