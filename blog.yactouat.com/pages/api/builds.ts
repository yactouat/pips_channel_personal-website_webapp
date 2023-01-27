// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { APIResponseType } from "pips_resources_definitions/dist/types";
import type { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponseType>
) {
  let processOk = false;
  const pubsubTokenAud = process.env.PUBSUB_TOKEN_AUDIENCE;
  const pubsubTokenEmail = process.env.PUBSUB_TOKEN_EMAIL;

  if (req.method === "POST") {
    // get the Cloud Pub/Sub-generated JWT in the "Authorization" header.
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.substring(7);
    console.log("encoded jwt token from google", token);

    // decode the JWT
    const decodedToken = jwtDecode(token);
    console.log("decoded jwt token from google", decodedToken);

    // verifying the claims
    processOk =
      (
        decodedToken as {
          aud: string;
        }
      ).aud === pubsubTokenAud &&
      (
        decodedToken as {
          email: string;
        }
      ).email === pubsubTokenEmail;
    console.log("processOk", processOk ? "true" : "false");

    // the message is a unicode string encoded in base64.
    const message = JSON.parse(
      Buffer.from(req.body.message.data, "base64").toString("utf-8")
    );
    console.log("message from google", message);
  }

  if (processOk) {
    // TODO trigger Vercel build
  }

  if (processOk) {
    res
      .status(200)
      .json({ msg: "blog.yactouat.com build triggered", data: null });
  } else {
    res.status(400).json({ msg: "bad request", data: null });
  }
}
