// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { APIResponseType } from "pips_resources_definitions/dist/types";
import { comesFromLegitPubSub } from "pips_resources_definitions/dist/behaviors";
import type { NextApiRequest, NextApiResponse } from "next";

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
    // validating inbound payload from Google Cloud Pub/Sub
    let pubSubEventWorkflowOk = comesFromLegitPubSub(
      req,
      process.env.PUBSUB_TOKEN_AUDIENCE as string,
      process.env.PUBSUB_TOKEN_EMAIL as string
    );
    // responding to the inbound request so no reties will be attempted
    if (pubSubEventWorkflowOk) {
      console.log("Pub/Sub event workflow outcome OK");
      res
        .status(200)
        .json({ msg: "blog.yactouat.com build triggered", data: null });
    } else {
      console.log("Pub/Sub event workflow outcome KO");
      res
        .status(400)
        .json({ msg: "Pub/Sub event workflow outcome KO", data: null });
    }
    // posting the build request
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
  }
}
