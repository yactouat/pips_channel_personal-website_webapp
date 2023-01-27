// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { APIResponseType } from "pips_resources_definitions/dist/types";
import type { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";

import getVercelBuilds from "@/lib/get-vercel-builds";
import postVercelBuild from "@/lib/post-vercel-builds";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponseType>
) {
  if (req.method === "GET") {
    const builds = await getVercelBuilds(true);
    res.status(200).json({
      msg: `blog.yactouat.com ${builds.length} latest builds`,
      data: builds,
    });
  }
  if (req.method === "POST") {
    let pubSubEventWorkflowOk = false;
    const pubsubTokenAud = process.env.PUBSUB_TOKEN_AUDIENCE;
    const pubsubTokenEmail = process.env.PUBSUB_TOKEN_EMAIL;
    // get the Cloud Pub/Sub-generated JWT in the "Authorization" header.
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.substring(7);
    console.log("encoded jwt token from google", token);

    // decode the JWT
    const decodedToken = jwtDecode(token);
    console.log("decoded jwt token from google", decodedToken);

    // verifying the claims
    console.log(
      "google decoded audience",
      decodedToken as {
        aud: string;
      }
    );
    pubSubEventWorkflowOk =
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
    console.log(
      "Pub/Sub event workflow parsing data from google part",
      pubSubEventWorkflowOk ? "OK" : "KO"
    );

    // the message is a unicode string encoded in base64.
    const message = JSON.parse(
      Buffer.from(req.body.message.data, "base64").toString("utf-8")
    );
    console.log("message from google", message);

    if (pubSubEventWorkflowOk) {
      try {
        await postVercelBuild();
        console.log("Pub/Sub event workflow Vercel build part OK");
      } catch (error) {
        pubSubEventWorkflowOk = false;
        console.error(error);
        console.log("Pub/Sub event workflow Vercel build part KO");
      }
    }

    if (pubSubEventWorkflowOk) {
      console.log("Pub/Sub event workflow outcome OK");
      res
        .status(200)
        .json({ msg: "blog.yactouat.com build triggered", data: null });
    } else {
      console.log("Pub/Sub event workflow outcome KO");
      res
        .status(500)
        .json({ msg: "Pub/Sub event workflow outcome KO", data: null });
    }
  }
}
