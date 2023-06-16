import Avatar from "@core/components/elements/avatar";
import Button from "@core/components/elements/button";
import Pin from "@core/components/elements/pin";
import Report from "@core/components/modals/report";
import Hero from "@core/components/sections/hero";
import useSession from "@core/hooks/use-session";
import prisma from "@core/libraries/prisma";
import { MapPinIcon, AtSymbolIcon, UserIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import Panels from "./panels";

type Props = {
  params: {
    username: string;
  };
};

const Page = async ({ params }: Props) => {
  const session = await useSession();
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      offers: {
        include: {
          gig: true,
          freelancer: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const freelancer = await prisma.freelancer.findUnique({
    where: { userId: user?.id },
    include: {
      gigs: {
        include: {
          category: true,
          thumbnails: true,
          reviews: true,
          freelancer: {
            include: {
              user: true,
            },
          },
        },
      },
      educations: true,
      employments: true,
      testimonials: true,
      skills: {
        include: {
          technology: true,
        },
      },
      offers: {
        include: {
          user: true,
          gig: true,
        },
      },
    },
  });

  return (
    <>
      <Hero image="https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" />
      <section className="contain w-full ">
        <div className="ml-4 flex gap-8">
          <Avatar
            src={user?.image!}
            alt={user?.name!}
            size="large"
            className="-mt-20 rounded-full border"
          />
          <div className="flex w-full flex-col justify-end space-y-2">
            <h1 className="text-5xl font-bold">{user?.name}</h1>
            <div className="flex gap-4">
              <Pin size="medium" Icon={AtSymbolIcon}>
                {user?.username}
              </Pin>
              {user?.location ? (
                <Pin size="medium" Icon={MapPinIcon}>
                  {user?.location}
                </Pin>
              ) : null}
              <Pin size="medium" Icon={UserIcon}>
                {moment(user?.createdAt!).format("LL")}
              </Pin>
              {freelancer ? (
                <span className="mt-auto w-fit rounded bg-primary-dark py-1 px-3 text-xs font-semibold text-white">
                  freelancer
                </span>
              ) : null}
            </div>
          </div>
          
          {session?.user?.email !== user?.email ? (
            <Report userId={user?.id!} />
          ) : null}
        </div>
      </section>

      {/* @ts-ignore*/}
      <Panels user={user} session={session} freelancer={freelancer} />
    </>
  );
};

export default Page;
