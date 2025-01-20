const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send email along with options object
  await transporter.sendMail({
    from: "Ryne James Gandia 👨🏻‍💻 <imrynegandia@gmail.com>",
    to: options.receiver,
    subject: options.subject,
    text: options.message,
  });
};

module.exports = sendEmail;
