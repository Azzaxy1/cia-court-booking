import nodemailer from "nodemailer";
import toast from "react-hot-toast";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface PaymentSuccessEmailData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  courtName: string;
  amount: number;
  date: string;
  timeSlot: string;
  paymentMethod: string;
}

export const sendPaymentSuccessEmail = async (
  data: PaymentSuccessEmailData
) => {
  const {
    customerEmail,
    customerName,
    orderId,
    courtName,
    amount,
    date,
    timeSlot,
    paymentMethod,
  } = data;

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #005d69; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success-icon { font-size: 48px; color: #005d69; text-align: center; margin-bottom: 20px; }
            .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total-amount { background-color: #005d69; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>CIA Court Serang</h1>
                <p>Konfirmasi Pembayaran</p>
            </div>
            
            <div class="content">
                <div class="success-icon">✅</div>
                
                <h2 style="text-align: center; color: #005d69;">Pembayaran Berhasil!</h2>
                
                <p>Halo <strong>${customerName}</strong>,</p>
                
                <p>Terima kasih! Pembayaran Anda untuk pemesanan lapangan telah berhasil diproses.</p>
                
                <div class="booking-details">
                    <h3 style="margin-top: 0; color: #005d69;">Detail Pemesanan</h3>
                    
                    <div class="detail-row">
                        <span><strong>ID Pesanan:</strong></span>
                        <span>${orderId}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span><strong>Lapangan:</strong></span>
                        <span>${courtName}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span><strong>Tanggal:</strong></span>
                        <span>${new Date(date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span><strong>Waktu:</strong></span>
                        <span>${timeSlot}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span><strong>Metode Pembayaran:</strong></span>
                        <span>${paymentMethod}</span>
                    </div>
                </div>
                
                <div class="total-amount">
                    Total Pembayaran: Rp ${amount.toLocaleString("id-ID")}
                </div>
                
                <p><strong>Informasi Penting:</strong></p>
                <ul>
                    <li>Silakan datang 15 menit sebelum waktu bermain</li>
                    <li>Tunjukkan email ini kepada kasir</li>
                    <li>Hubungi kami di +62 851-8219-8144 jika ada pertanyaan</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; font-size: 14px;">
                        Email ini dikirim secara otomatis dari sistem CIA Court Serang<br>
                        Jl. Cilampang, Unyur, Kec. Serang, Kota Serang, Banten 42111<br>
                        Telp: +62 851-8219-8144
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"CIA Court Serang" <${process.env.SMTP_USERNAME}>`,
      to: customerEmail,
      subject: `Konfirmasi Pembayaran - Pesanan ${orderId}`,
      html: emailContent,
    });

    toast.success(`Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
