import prisma from "@core/libraries/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    try {
      await prisma.report.create({
        data: {
          userId: request.body.userId,
          message: request.body.message,
        },
      });
      response.json("Good");
    } catch (error) {
      console.log(error);
      response.status(505).json("Internal Server Error");
    }
  }
};

export default handler;
