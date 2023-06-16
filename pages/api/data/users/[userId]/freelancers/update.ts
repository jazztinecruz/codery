import prisma from "@core/libraries/prisma";
import { type NextApiRequest, type NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "PUT") {
    const { userId } = request.query;
    const { body } = request;
    try {
      await prisma.user.update({
        where: { id: String(userId) },
        data: {
          biography: body.biography,
          phone: body.phone,
          location: body.location,
        },
      });
      await prisma.freelancer.update({
        where: { userId: String(userId) },
        data: {
          skills: body.skills,
          employments: body.employments,
          educations: body.educations,
          testimonials: body.testimonials,
        },
      });
      response.status(201).send({ message: "OK" });
    } catch (error) {
      console.error(error);
      response.status(500).send({ error });
    }
  }
};

export default handler;
