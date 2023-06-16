import prisma from "@core/libraries/prisma";
import { type NextApiRequest, type NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "PUT") {
    const { body } = request;
    try {
      const user = await prisma.user.findUnique({ where: { id: body.userId } });

      if (!user) {
        response.status(404).send({ message: "User not found" });
        return;
      }

      if (user.suspension! >= 5) {
        response.status(400).send({ message: "Maximum suspension Reached." });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: body.userId },
        data: {
          suspension: user.suspension! + 1,
        },
      });

      response.status(201).send({ message: "OK", user: updatedUser });
    } catch (error) {
      console.error(error);
      response.status(500).send({ error });
    }
  }
};

export default handler;
