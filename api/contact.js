const DESTINATION = 'zaturateams@gmail.com';
const LIMIT = 5000;
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'});}
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (b.website) return res.status(200).json({ok:true}); // honeypot
    const clean = (x, max=LIMIT) => String(x || '').trim().slice(0,max);
    const name=clean(b.name,120), email=clean(b.email,254), company=clean(b.company,150), service=clean(b.service,150), budget=clean(b.budget,100), description=clean(b.description), page=clean(b.page,200);
    if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !service || description.length<10) return res.status(400).json({ok:false,error:'Please complete all required fields correctly.'});
    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) return res.status(503).json({ok:false,error:'Email delivery has not been configured yet.'});
    const html = [ ['Name',name],['Email',email],['Company',company],['Request',service],['Budget',budget],['Description',description],['Page',page] ].map(([k,v])=>`<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v).replace(/\n/g,'<br>')}</p>`).join('');
    const response = await fetch('https://api.resend.com/emails', {method:'POST',headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.FROM_EMAIL,to:[DESTINATION],reply_to:email,subject:`Zatura ${service === 'Book a Product Demo' ? 'Demo Request' : 'Enquiry'} — ${name}`,html})});
    if (!response.ok) { console.error('Resend failure',response.status,await response.text()); return res.status(502).json({ok:false,error:'Email could not be delivered. Please try again.'}); }
    return res.status(200).json({ok:true});
  } catch(e) { console.error('Contact error',e); return res.status(500).json({ok:false,error:'Unable to send right now. Please try again.'}); }
};
function escapeHtml(s) {return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
