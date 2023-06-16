import UpdateFreelancer from "@core/components/sections/update-freelancer";
import useUser from "@core/hooks/use-user";
import prisma from "@core/libraries/prisma";
import serialize from "@core/utilities/serialize";

const Page = async () => {
  const user = await useUser();

  const freelancer = await prisma.freelancer.findUnique({
    where: {
      userId: user?.id,
    },
    include: {
      educations: true,
      employments: true,
      skills: {
        include: {
          technology: true,
        },
      },
      testimonials: true,
    },
  });

  console.log({ freelancer });

  return (
    <>
      <UpdateFreelancer user={serialize(user)} freelancer={freelancer} />
    </>
  );
};

export default Page;
