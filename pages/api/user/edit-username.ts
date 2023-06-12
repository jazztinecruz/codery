import prisma from "@core/libraries/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "PUT") {
    try {
      await prisma.user.update({
        where: {
          id: JSON.parse(request.body).id,
        },
        data: {
          username: JSON.parse(request.body).username,
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
