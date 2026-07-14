import transporter from "../config/mail.js";

const sendEmail = async (
  email,
  subject,
  html
) => {
  await transporter.sendMail({
    to: email,
    subject,
    html
  });
};

export default sendEmail;