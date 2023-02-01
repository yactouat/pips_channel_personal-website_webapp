// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { APIResponseType } from "pips_resources_definitions/dist/types";
import {
  comesFromLegitPubSub,
  decodePubSubMessage,
  sendJsonResponse,
} from "pips_resources_definitions/dist/behaviors";
import type { NextApiRequest, NextApiResponse } from "next";

import getVercelBuilds from "@/lib/functions/get-vercel-builds";
import postVercelBuild from "@/lib/functions/post-vercel-builds";

interface BlogPostPublishedPubSubMessage {
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponseType>
) {
  if (req.method !== "GET" && req.method !== "POST") {
    sendJsonResponse(res, 405, "Method not allowed");
    return;
  }
  if (req.method === "GET") {
    const builds = await getVercelBuilds(true);
    sendJsonResponse(
      res,
      200,
      `blog.yactouat.com ${builds.length} latest builds`,
      builds
    );
    return;
  }
  // POST request processing
  // validating inbound payload from Google Cloud Pub/Sub
  let pubSubEventWorkflowOk = comesFromLegitPubSub(
    req,
    process.env.PUBSUB_TOKEN_AUDIENCE as string,
    process.env.PUBSUB_TOKEN_EMAIL as string
  );
  const message = decodePubSubMessage(req);
  // console.log("Pub/Sub event workflow message", message);
  // posting the build request only if published post
  if (
    pubSubEventWorkflowOk &&
    (message as BlogPostPublishedPubSubMessage).name.startsWith("published")
  ) {
    try {
      await postVercelBuild();
    } catch (error) {
      console.log("Pub/Sub event workflow Vercel build part KO");
    }
  }
  // responding to the inbound request so no reties will be attempted
  if (pubSubEventWorkflowOk) {
    console.log("Pub/Sub event workflow outcome OK");
    sendJsonResponse(res, 200, "blog.yactouat.com build triggered");
  } else {
    console.log("Pub/Sub event workflow outcome KO");
    sendJsonResponse(res, 422, "Pub/Sub event workflow outcome KO");
  }
}
