import nodemailer from 'nodemailer'

// Function to send email with the status of the packages
export const sendEmail = async (emailContent: string) => {
  const mailOptions = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  }

  try {
    const transporter = nodemailer.createTransport(mailOptions)
    const verifyConnection = await transporter.verify()
    if (verifyConnection) {
      const send = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`, // sender address
        to: process.env.RECIPIENT_EMAILS?.split(',') || '', // list of receivers
        subject: 'Liberty express package statatus update ✔', // Subject line
        text: emailContent, // plain text body
        html: `<b>${emailContent}</b>`, // html body
      })

      console.log('Email sent!', { send })
    }
  } catch (err) {
    console.log('Error while sending email', err)
  }
}
