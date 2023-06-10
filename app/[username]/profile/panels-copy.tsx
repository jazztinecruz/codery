"use client";

import Avatar from "@core/components/elements/avatar";
import Badge from "@core/components/elements/badge";
import Button from "@core/components/elements/button";
import { Menu, Tab } from "@headlessui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Category,
  Education,
  Employment,
  Freelancer,
  Gig,
  Offer,
  Skill,
  Status,
  Technology,
  Testimonial,
  Thumbnail,
  User,
} from "@prisma/client";
import Image from "next/image";
import { Fragment } from "react";

type Props = {
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
        gigs: (Gig & { category: Category; thumbnails: Thumbnail[] })[];
        skills: (Skill & { technology: Technology })[];
      })
    | null;
};

const Panels = ({ user, freelancer }: Props) => {
  const panels = [
    { title: "Freelancer Details", show: freelancer ?? false },
    { title: "Manage Gigs", show: freelancer ?? false },
    { title: "Track Offers", show: true },
    { title: "Billing Information", show: true },
    { title: "Rating and Reviews", show: true },
  ];

  return (
    <section className="contain space-y-4">
      <Tab.Group as="div" className="flex w-full gap-6">
        <Tab.List className="flex h-fit flex-col items-center border bg-white">
          {panels.map((panel) => (
            <Tab
              key={panel.title}
              className={({ selected }) =>
                `${
                  selected
                    ? "bg-primary-brand text-white"
                    : "text-primary-dark hover:bg-slate-100"
                } ${
                  panel.show ? "block" : "hidden"
                } w-full whitespace-nowrap border-b px-4 py-2.5 text-sm font-medium leading-5 outline-none`
              }>
              {panel.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels as="div" className="w-full">
          {freelancer ? (
            <Tab.Panel>
              {/* basic */}
              <section className="mb-2 flex flex-wrap gap-3">
                <div className="flex flex-col">
                  <h1 className="mb-2 font-semibold">Biography</h1>
                  <div className="flex w-fit flex-col flex-wrap gap-1 rounded border bg-white py-3 px-6">
                    {user?.biography}
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="mb-2 font-semibold">Phone</h1>
                  <div className="flex w-fit flex-col gap-1 rounded border bg-white py-3 px-6">
                    {user?.phone}
                  </div>
                </div>
              </section>

              {/* skills */}
              <h1 className="mb-2 font-semibold">Skills</h1>
              <section className="flex flex-wrap items-center gap-3">
                {freelancer?.skills.map(({ id, technology }) => (
                  <Badge key={id} name={technology!.name} />
                ))}
              </section>

              {/* educations */}
              <h1 className="my-4 font-semibold">Educations</h1>
              <section className="flex flex-wrap items-center gap-3">
                {freelancer?.educations.map((education) => (
                  <div
                    key={education.id}
                    className="flex flex-col gap-1 rounded border bg-white py-3 px-6">
                    <h1 className="text-bold font-semibold">
                      {education.degree}
                    </h1>
                    <h2 className="-mt-1 text-sm font-semibold">
                      {education.area}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {education.school}
                    </span>
                    <span className="text-xs text-gray-500">
                      {education.from}-{education.to}
                    </span>
                  </div>
                ))}
              </section>

              {/* employments */}
              <h1 className="my-4 font-semibold">Employments</h1>
              <section className="flex flex-wrap items-center gap-3">
                {freelancer?.employments.map((employment) => (
                  <div
                    key={employment.id}
                    className="flex flex-col gap-1 rounded border bg-white py-3 px-6">
                    <h1 className="text-bold font-semibold">
                      {employment.position}
                    </h1>
                    <h2 className="-mt-1 text-sm font-semibold">
                      {employment.location}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {employment.description}
                    </span>
                    <span className="text-xs text-gray-500">
                      {employment.from}-{employment.to}
                    </span>
                    <span className="text-sm text-gray-500">
                      {employment.isActive}
                    </span>
                  </div>
                ))}
              </section>

              {/* testimonials */}
              <h1 className="my-4 font-semibold">Testimonials</h1>
              <section className="flex flex-wrap items-center gap-3">
                {freelancer?.testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex flex-col gap-1 rounded border bg-white py-3 px-6">
                    <h1 className="text-bold font-semibold">
                      {testimonial.name}
                    </h1>
                    <h2 className="-mt-1 text-sm font-semibold">
                      {testimonial.position}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {testimonial.email}
                    </span>
                    <p className="text-sm text-gray-500">
                      {testimonial.message}
                    </p>
                  </div>
                ))}
              </section>
            </Tab.Panel>
          ) : null}

          {/* MANAGE GIGS */}
          {freelancer ? (
            <Tab.Panel>
              {freelancer.gigs?.map((gig) => (
                <div
                  key={gig.id}
                  className="flex cursor-pointer items-center gap-4 p-2 shadow hover:bg-slate-100">
                  <Image
                    src={gig.thumbnails[0].image}
                    alt="gig image"
                    width={30}
                    height={30}
                    className="border-4"
                  />
                  <div>
                    <h2 className="font-semibold">{gig.title}</h2>
                    <h6 className="text-xs">{gig.category.name}</h6>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <PencilSquareIcon className="h-5 w-5" />
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              ))}
            </Tab.Panel>
          ) : null}

          {/* TRACK OFFERS */}
          <Tab.Panel>
            <>
              {freelancer?.offers
                .filter((offer) => offer.isAccepted)
                .map((offer) => (
                  <div
                    key={offer.id}
                    className="grid grid-cols-[3fr,1fr,1fr,1fr,1fr] items-center gap-6 p-2 shadow hover:bg-slate-100">
                    <h2 className="font-semibold">{offer.gig.title}</h2>
                    <h6>${offer.price}</h6>
                    <h6>{offer.status}</h6>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={offer.user.image!}
                        alt="profile"
                        size="small"
                      />
                      <h6>{offer.user.name}</h6>
                    </div>
                    <Menu as="div" className="relative">
                      <Menu.Button>
                        <Button>ACTION</Button>
                      </Menu.Button>
                      <Menu.Items className="absolute top-8 right-0 z-10 flex w-64 flex-col bg-white shadow-lg">
                        {Object.values(Status).map((status: any) => (
                          <Menu.Item key={status} as={Fragment}>
                            <button className="px-4 py-3 hover:bg-primary-dark hover:text-white">
                              {status}
                            </button>
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Menu>
                  </div>
                ))}

              {user?.offers
                .filter((offer) => offer.isAccepted)
                .map((offer) => (
                  <div
                    key={offer.id}
                    className="grid grid-cols-[3fr,1fr,1fr,1fr,1fr] items-center gap-6 p-2 shadow hover:bg-slate-100">
                    <h2 className="font-semibold">{offer.gig.title}</h2>
                    <h6>${offer.price}</h6>
                    <h6>{offer.status}</h6>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={offer.freelancer.user.image!}
                        alt="profile"
                        size="small"
                      />
                      <h6>{offer.freelancer.user.name}</h6>
                    </div>
                  </div>
                ))}
            </>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
};

export default Panels;
