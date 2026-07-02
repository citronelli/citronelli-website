const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = 'citronelli@quell-frisch.de';
const FROM_EMAIL = 'Citronelli Website <noreply@contact.quell-frisch.de>';

function buildEmail({ name, unternehmen, email, anfrage, nachricht }) {
  const field = (label, value) => value ? `
    <tr>
      <td style="padding:0 0 24px 0;border-bottom:1px solid #eaf8f6;padding-bottom:24px;">
        <p style="margin:0 0 5px;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#2e8378;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${label}</p>
        <p style="margin:0;font-size:15px;color:#0f2e2a;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.5;">${value}</p>
      </td>
    </tr>
    <tr><td style="height:24px;line-height:24px;font-size:1px;">&nbsp;</td></tr>
  ` : '';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Neue Anfrage — Quellfrisch</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f9f8;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f9f8;">
  <tr>
    <td align="center" style="padding:48px 24px;">
      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#ffffff;padding:36px 48px 28px;border-top:3px solid #99e1d9;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <img src="https://quell-frisch.de/brand_assets/QF%20Logo.png" alt="QF" width="44" height="44" style="display:block;">
                </td>
                <td style="vertical-align:middle;padding-left:14px;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#0f2e2a;letter-spacing:0.06em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">QUELLFRISCH GMBH</p>
                  <p style="margin:3px 0 0;font-size:10px;color:#46a99e;letter-spacing:0.1em;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Getränke · Wasser</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <p style="margin:0;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#99e1d9;background:#0f2e2a;display:inline-block;padding:5px 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Neue Anfrage</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- INTRO -->
        <tr>
          <td style="background-color:#ffffff;padding:0 48px 32px;">
            <p style="margin:0;font-size:13.5px;color:#3a3a3a;line-height:1.75;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
              Eine neue Kontaktanfrage über <strong style="color:#0f2e2a;">quell-frisch.de</strong> ist eingegangen.
            </p>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr>
          <td style="background-color:#ffffff;padding:0 48px;">
            <div style="border-top:1px solid #eaf8f6;"></div>
          </td>
        </tr>

        <!-- FIELDS -->
        <tr>
          <td style="background-color:#ffffff;padding:32px 48px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${field('Name', name)}
              ${field('Unternehmen', unternehmen)}
              <tr>
                <td style="padding-bottom:24px;">
                  <p style="margin:0 0 5px;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#2e8378;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">E-Mail</p>
                  <a href="mailto:${email}" style="font-size:15px;color:#0f2e2a;font-weight:500;text-decoration:none;border-bottom:1px solid #99e1d9;padding-bottom:1px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${email}</a>
                </td>
              </tr>
              <tr><td style="height:24px;line-height:24px;font-size:1px;">&nbsp;</td></tr>
              ${field('Anfrage', anfrage)}
            </table>
          </td>
        </tr>

        <!-- NACHRICHT -->
        <tr>
          <td style="background-color:#ffffff;padding:0 48px 40px;">
            <p style="margin:0 0 10px;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#2e8378;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Nachricht</p>
            <div style="background-color:#f4fcfb;border-left:3px solid #99e1d9;padding:18px 22px;">
              <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;white-space:pre-wrap;">${nachricht}</p>
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background-color:#ffffff;padding:0 48px 48px;">
            <a href="mailto:${email}?subject=Re: Ihre Anfrage bei Quellfrisch" style="display:inline-block;background-color:#0f2e2a;color:#99e1d9;font-size:10px;letter-spacing:0.13em;text-transform:uppercase;text-decoration:none;padding:14px 30px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:500;">Direkt antworten &rarr;</a>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0f2e2a;padding:24px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11.5px;color:#99e1d9;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Quellfrisch GmbH — citronelli™</p>
                  <p style="margin:5px 0 0;font-size:10.5px;color:rgba(153,225,217,0.5);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">quell-frisch.de</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <p style="margin:0;font-size:9px;color:rgba(153,225,217,0.35);letter-spacing:0.1em;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Website-Formular</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, unternehmen, email, anfrage, nachricht } = req.body;

  if (!name || !email || !nachricht) {
    return res.status(400).json({ error: 'Pflichtfelder fehlen.' });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Neue Anfrage von ${name}${unternehmen ? ` (${unternehmen})` : ''} — quell-frisch.de`,
      reply_to: email,
      html: buildEmail({ name, unternehmen, email, anfrage, nachricht }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Email konnte nicht gesendet werden.' });
  }
};
