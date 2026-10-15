export interface AdminEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt?: Date | string;
}

export function generateAdminEmailHtml(data: AdminEmailPayload): string {
  const { name, email, subject, message } = data;
  const formattedDate = data.submittedAt
    ? new Date(data.submittedAt).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : new Date().toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  // Escape HTML helper
  const esc = (str: string) =>
    (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeName = esc(name);
  const safeEmail = esc(email);
  const safeSubject = esc(subject);
  const safeMessage = esc(message).replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry - Swati Ajay Kulkarni</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f3f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2b1f18;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
    }
    img {
      border: 0;
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #f7f3f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2b1f18;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #e8dfd8; box-shadow: 0 10px 30px rgba(43,31,24,0.06); overflow: hidden;">
    
    <!-- Top Terracotta Accent Banner -->
    <tr>
      <td style="background-color: #a8522e; height: 6px; line-height: 6px; font-size: 6px;">&nbsp;</td>
    </tr>

    <!-- Header Section -->
    <tr>
      <td style="padding: 36px 36px 24px 36px; border-bottom: 1px solid #f0e8e2;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="display: inline-block; padding: 4px 12px; background-color: #fbeee8; border-radius: 100px; color: #a8522e; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                New Portfolio Message
              </div>
              <h1 style="margin: 14px 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; color: #2b1f18; line-height: 1.25;">
                Contact Form Submission
              </h1>
              <p style="margin: 0; font-size: 13.5px; color: #7d6b60; line-height: 1.5;">
                Received via the contact form on your portfolio website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Sender Details Table -->
    <tr>
      <td style="padding: 28px 36px 12px 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fcfaf8; border: 1px solid #ede4dc; border-radius: 14px; overflow: hidden;">
          <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #ede4dc; width: 120px; font-size: 12px; font-weight: 700; color: #8e7a6f; text-transform: uppercase; letter-spacing: 0.08em;">
              Sender Name
            </td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #ede4dc; font-size: 14.5px; font-weight: 600; color: #2b1f18;">
              ${safeName}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #ede4dc; font-size: 12px; font-weight: 700; color: #8e7a6f; text-transform: uppercase; letter-spacing: 0.08em;">
              Email Address
            </td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #ede4dc; font-size: 14px;">
              <a href="mailto:${safeEmail}" style="color: #a8522e; text-decoration: none; font-weight: 500;">
                ${safeEmail}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #ede4dc; font-size: 12px; font-weight: 700; color: #8e7a6f; text-transform: uppercase; letter-spacing: 0.08em;">
              Subject
            </td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #ede4dc; font-size: 14px; font-weight: 600; color: #2b1f18;">
              ${safeSubject}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 20px; font-size: 12px; font-weight: 700; color: #8e7a6f; text-transform: uppercase; letter-spacing: 0.08em;">
              Submitted At
            </td>
            <td style="padding: 16px 20px; font-size: 13.5px; color: #5a4b41;">
              ${formattedDate}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Message Content Box -->
    <tr>
      <td style="padding: 16px 36px 28px 36px;">
        <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #8e7a6f; text-transform: uppercase; letter-spacing: 0.08em;">
          Message
        </p>
        <div style="background-color: #faf6f2; border-left: 4px solid #a8522e; border-top: 1px solid #eee5dd; border-right: 1px solid #eee5dd; border-bottom: 1px solid #eee5dd; border-radius: 0 12px 12px 0; padding: 22px 24px; font-size: 14.5px; line-height: 1.65; color: #3b2e25;">
          ${safeMessage}
        </div>
      </td>
    </tr>

    <!-- Action Buttons -->
    <tr>
      <td style="padding: 0 36px 36px 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display: inline-block; background-color: #a8522e; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 100px; font-size: 13.5px; font-weight: 600; letter-spacing: 0.03em; box-shadow: 0 4px 14px rgba(168,82,46,0.35);">
                Reply to ${safeName} &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 36px; background-color: #f7f1ec; border-top: 1px solid #ede3da; text-align: center;">
        <p style="margin: 0 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: 600; color: #4a3c33;">
          Swati Ajay Kulkarni &bull; Photography Portfolio
        </p>
        <p style="margin: 0; font-size: 11.5px; color: #9c8a7e; line-height: 1.4;">
          This message was sent securely from your website's contact form.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;
}
