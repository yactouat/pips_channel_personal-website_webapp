// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { APIResponseType } from "pips_resources_definitions/dist/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponseType>
) {
  res
    .status(200)
    .json({ msg: "blog.yactouat.com build triggered", data: null });
}
