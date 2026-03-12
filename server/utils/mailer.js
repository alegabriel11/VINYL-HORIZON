const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configuración de transporte village
// NOTA: Para Gmail, usa "App Passwords". Para otros, usa SMTP configuración. village
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetEmail = async (email, token) => {
    // Si las credenciales son las por defecto o están vacías, usamos modo desarrollo village
    const isDefault = !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER.includes('tu_correo') ||
        process.env.EMAIL_PASS.includes('tu_app_password');

    if (isDefault) {
        console.log("\n--- 🛠️  MODO DESARROLLO: Token de Recuperación ---");
        console.log(`📧 Destinatario: ${email}`);
        console.log(`🔑 Token: ${token}`);
        console.log(`🔗 Link: http://localhost:5173/forgot-password?token=${token}`);
        console.log("------------------------------------------------\n");
        return;
    }

    const resetLink = `http://localhost:5173/forgot-password?token=${token}`;

    const mailOptions = {
        from: `"Vinyl Horizon" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Restablecer Contraseña - Vinyl Horizon',
        html: `
            <div style="font-family: ' Montserrat', sans-serif; background-color: #F3F0EC; padding: 40px; border-radius: 20px;">
                <h1 style="color: #5E1914; text-align: center;">Vinyl Horizon</h1>
                <p style="color: #0B1B2A; font-size: 16px;">Hola,</p>
                <p style="color: #0B1B2A; font-size: 16px;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #5E1914; color: #F3F0EC; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Restablecer Contraseña</a>
                </div>
                <p style="color: #0B1B2A; font-size: 14px;">Si no solicitaste esto, puedes ignorar este correo.</p>
                <p style="color: #0B1B2A; font-size: 12px; opacity: 0.6; margin-top: 40px;">Este enlace expirará en 1 hora.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Correo de restablecimiento enviado a ${email}`);
    } catch (error) {
        console.error("❌ Error enviando correo (SMTP):", error.message);
        console.log("\n--- ⚠️  FALLBACK: Link de Recuperación (Terminal) ---");
        console.log(`📧 Destinatario: ${email}`);
        console.log(`🔗 Link: ${resetLink}`);
        console.log("---------------------------------------------------\n");
    }
};

module.exports = { sendResetEmail };
