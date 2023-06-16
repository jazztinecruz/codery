"use client";

import Badge from "@core/components/elements/badge";
import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Modal from "@core/components/layouts/modal";
import useModal from "@core/hooks/use-modal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
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
import Link from "next/link";
import Container from "./container";

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

const FreelancerDetails = ({ user, session, freelancer }: Props) => {
  return (
    <>
      <section className="flex flex-col gap-4">
        {session?.user?.email === user?.email && (
          <Link href={`/${user?.username}/edit-freelancer`}>
            <PencilSquareIcon className="h-5 w-5 cursor-pointer" />
          </Link>
        )}

        <section className="flex flex-wrap gap-3">
          <Container label="Biography">{user?.biography}</Container>
          <Container label="Phone">{user?.phone}</Container>
        </section>

        {/* skills */}
        <h1 className="font-semibold">Skills</h1>
        <section className="flex flex-wrap items-center gap-3">
          {freelancer?.skills.map(({ id, technology }) => (
            <Badge key={id} name={technology!.name} />
          ))}
        </section>

        {/* educations */}
        <h1 className="font-semibold">Educations</h1>
        <section className="flex flex-wrap items-center gap-3">
          {freelancer?.educations.map((education) => (
            <Container key={education.id}>
              <h1 className="text-bold font-semibold">{education.degree}</h1>
              <h2 className="-mt-1 text-sm font-semibold">{education.area}</h2>
              <span className="text-sm text-gray-500">{education.school}</span>
              <span className="text-xs text-gray-500">
                {education.from}-{education.to}
              </span>
            </Container>
          ))}
        </section>

        {/* employments */}
        <h1 className="font-semibold">Employments</h1>
        <section className="flex flex-wrap items-center gap-3">
          {freelancer?.employments.map((employment) => (
            <Container key={employment.id}>
              <h1 className="text-bold font-semibold">{employment.position}</h1>
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
            </Container>
          ))}
        </section>

        {/* testimonials */}
        <h1 className="font-semibold">Testimonials</h1>
        <section className="flex flex-wrap items-center gap-3">
          {freelancer?.testimonials.map((testimonial) => (
            <Container key={testimonial.id}>
              <h1 className="text-bold font-semibold">{testimonial.name}</h1>
              <h2 className="-mt-1 text-sm font-semibold">
                {testimonial.position}
              </h2>
              <span className="text-xs text-gray-500">{testimonial.email}</span>
              <p className="text-sm text-gray-500">{testimonial.message}</p>
            </Container>
          ))}
        </section>
      </section>
    </>
  );
};

export default FreelancerDetails;
