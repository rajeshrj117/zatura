# Zatura forms — Vercel deployment

Deploy the **entire folder** (not just index.html) to Vercel. The `/api/contact` serverless function handles all enquiries and demo requests.

## Required setup (one-time)
1. Sign up at https://resend.com and verify a sending domain you own (for example, zatura.in) in Resend, adding its required DNS records.
2. In Vercel project → Settings → Environment Variables, add `RESEND_API_KEY` (your secret Resend API key) and `FROM_EMAIL` (a sender address on your verified domain, e.g. `Zatura <enquiries@zatura.in>`).
3. Redeploy. The form will send emails to `zaturateams@gmail.com`; the customer's address is set as reply-to.
4. Test both a normal enquiry and **Book a Free Product Demo** on the deployed domain. Verify delivery in Gmail and Resend logs, including spam folder.

**Important:** Until these environment variables and DNS verification are configured, the form deliberately displays an error instead of falsely claiming an enquiry was delivered. Static HTML hosting without Vercel serverless support cannot send the forms.

No API keys are included in this download. Add bot protection and rate limiting before high-volume marketing campaigns.
