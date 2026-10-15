export interface UserEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  portfolioUrl?: string;
}

export function generateUserEmailHtml(data: UserEmailPayload): string {
  const {
    name,
    email,
    subject,
    message,
    portfolioUrl = "https://swatiajaykulkarni.com",
  } = data;

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
  <title>Thank You For Your Message - Swati Ajay Kulkarni</title>
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
      <td style="padding: 40px 36px 28px 36px; text-align: center; border-bottom: 1px solid #f0e8e2;">
        <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #a8522e; text-transform: uppercase; letter-spacing: 0.22em;">
          Studio of Swati Ajay Kulkarni
        </p>
        <h1 style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: normal; color: #2b1f18; line-height: 1.25;">
          Thank You for Getting in Touch
        </h1>
        <p style="margin: 0 auto; max-width: 440px; font-size: 14.5px; color: #7d6b60; line-height: 1.6;">
          Your message has been received. Dr. Swati Ajay Kulkarni will review your inquiry and get back to you shortly.
        </p>
      </td>
    </tr>

    <!-- Salutation & Confirmation -->
    <tr>
      <td style="padding: 32px 36px 12px 36px;">
        <p style="margin: 0 0 14px 0; font-size: 15px; color: #2b1f18; line-height: 1.6;">
          Hello <strong>${safeName}</strong>,
        </p>
        <p style="margin: 0 0 20px 0; font-size: 14.5px; color: #5a4b41; line-height: 1.65;">
          Thank you for reaching out regarding <em>"${safeSubject}"</em>. Whether your inquiry concerns fine art photography prints, exhibition inquiries, custom commissions, or workshops, we truly appreciate your connection.
        </p>
        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #8e7a6f; text-transform: uppercase; letter-spacing: 0.1em;">
          Summary of Your Submission
        </p>
      </td>
    </tr>

    <!-- Submitted Details Card -->
    <tr>
      <td style="padding: 0 36px 24px 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf6f2; border: 1px solid #eee4db; border-radius: 14px; overflow: hidden;">
          <tr>
            <td style="padding: 14px 18px; border-bottom: 1px solid #eee4db; width: 110px; font-size: 12px; font-weight: 600; color: #8e7a6f; text-transform: uppercase;">
              Name
            </td>
            <td style="padding: 14px 18px; border-bottom: 1px solid #eee4db; font-size: 14px; font-weight: 500; color: #2b1f18;">
              ${safeName}
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 18px; border-bottom: 1px solid #eee4db; font-size: 12px; font-weight: 600; color: #8e7a6f; text-transform: uppercase;">
              Email
            </td>
            <td style="padding: 14px 18px; border-bottom: 1px solid #eee4db; font-size: 14px; color: #2b1f18;">
              ${safeEmail}
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 18px; border-bottom: 1px solid #eee4db; font-size: 12px; font-weight: 600; color: #8e7a6f; text-transform: uppercase;">
              Subject
            </td>
            <td style="padding: 14px 18px; border-bottom: 1px solid #eee4db; font-size: 14px; font-weight: 500; color: #2b1f18;">
              ${safeSubject}
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 18px; font-size: 12px; font-weight: 600; color: #8e7a6f; text-transform: uppercase; vertical-align: top;">
              Message
            </td>
            <td style="padding: 14px 18px; font-size: 13.5px; line-height: 1.6; color: #42352c;">
              ${safeMessage}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA Section -->
    <tr>
      <td style="padding: 12px 36px 36px 36px; text-align: center;">
        <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #7d6b60;">
          In the meantime, feel free to explore the recent photography collections and exhibitions:
        </p>
        <a href="${portfolioUrl}/gallery" style="display: inline-block; background-color: #a8522e; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 100px; font-size: 13.5px; font-weight: 600; letter-spacing: 0.04em; box-shadow: 0 4px 14px rgba(168,82,46,0.35);">
          Explore Gallery &rarr;
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 26px 36px; background-color: #f7f1ec; border-top: 1px solid #ede3da; text-align: center;">
        <p style="margin: 0 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: 600; color: #2b1f18;">
          Dr. Swati Ajay Kulkarni
        </p>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #7d6b60;">
          Artist &bull; Photographer &bull; Pune, India
        </p>
        <p style="margin: 0; font-size: 11px; color: #a49488; line-height: 1.5;">
          This is an automated confirmation of your submitted message.<br>
          If you did not send this inquiry, you can safely disregard this email.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;
}
