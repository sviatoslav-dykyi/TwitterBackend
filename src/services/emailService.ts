import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
require("dotenv").config(); // робимо це щоби запустити програмку із терміналу (щоби мати доступ до env)
const ses = new SESClient({ region: "eu-north-1" });

const rrr = process.env.AWS_ACCESS_KEY_ID;
console.log("rrr", rrr);

function createSendEmailCommand(
  toAddress: string,
  fromAddress: string,
  message: string
) {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress], // можна до багатьох одночасно
      CcAddresses: [],
    },
    Source: fromAddress, // хто відправляє імейл,
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your one-time password",
      },
      Body: {
        Text: { Charset: "UTF-8", Data: message },
      },
    },
  });
}

export async function sendEmailToken(email: string, token: string) {
  const message = `Your one-time password is ${token}`;
  const command = createSendEmailCommand(email, "s.dykyi@technoji.io", message);

  try {
    return await ses.send(command);
  } catch (error) {
    console.log("Error while sending email", error);
    return error;
  }
}
