"use client";

import { Tab } from "@headlessui/react";
import {
  Category,
  Education,
  Employment,
  Freelancer,
  Gig,
  Offer,
  Review,
  Skill,
  Technology,
  Testimonial,
  Thumbnail,
  User,
} from "@prisma/client";
import { Session } from "next-auth";
import AccountInformation from "./account-details";
import FreelancerDetails from "./freelancer-details";
import Gigs from "./gigs";
import ManageGigs from "./manage-gigs";
import TrackOffers from "./track-offers";

type Props = {
  session: Session | null;
  user:
    | (User & {
        offers: (Offer & {
          gig: Gig;
          freelancer: Freelancer & { user: User };
        })[];
      })
    | null;
  freelancer:
    | (Freelancer & {
        offers: (Offer & {
          gig: Gig;
          user: User;
        })[];
        educations: Education[];
        employments: Employment[];
        testimonials: Testimonial[];
        gigs: (Gig & {
          category: Category;
          reviews: Review[];
          thumbnails: Thumbnail[];
          freelancer: Freelancer & { user: User };
        })[];
        skills: (Skill & { technology: Technology })[];
      })
    | null;
};

const Panels = ({ user, freelancer, session }: Props) => {
  const panels = [
    {
      title: "Account Information",
      content: <AccountInformation user={user} />,
      show: session?.user?.email === user?.email ?? false,
    },
    {
      title: "Freelancer Details",
      content: <FreelancerDetails user={user} freelancer={freelancer} />,
      show: freelancer ?? false,
    },
    {
      title: "Manage Gigs",
      content: <ManageGigs freelancer={freelancer} />,
      show: (session?.user?.email === user?.email && freelancer) ?? false,
    },
    {
      title: "Track Offers",
      content: <TrackOffers user={user} freelancer={freelancer} />,
      show: session?.user?.email === user?.email ?? false,
    },
    {
      title: "Gigs",
      content: <Gigs freelancer={freelancer} />,
      show: freelancer ?? false,
    },
  ];

  return (
    <section className="contain space-y-4">
      <Tab.Group as="div" className="flex w-full gap-6">
        <Tab.List className="flex h-fit flex-col border bg-white">
          {panels.map((panel) =>
            panel.show ? (
              <div key={panel.title} className="flex flex-col">
                <Tab
                  className={({ selected }) =>
                    `${
                      selected
                        ? "bg-primary-brand text-white"
                        : "text-primary-dark hover:bg-slate-100"
                    } w-full whitespace-nowrap border-b px-4 py-2.5 text-left text-sm font-medium leading-5 outline-none`
                  }>
                  {panel.title}
                </Tab>
              </div>
            ) : null
          )}
        </Tab.List>

        <Tab.Panels className="flex w-full flex-grow ">
          {panels.map(
            (panel) =>
              panel.show && (
                <Tab.Panel key={panel.title}>{panel.content}</Tab.Panel>
              )
          )}
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
};

export default Panels;
