import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import useModal from "@core/hooks/use-modal";
import stores from "@core/stores";
import { ZodIssue } from "zod";
import Education from "./education";
import Testimonial from "./testimonial";
import Card from "../card";
import {
  Education as EducationType,
  Employment,
  Freelancer,
  Skill,
  Testimonial as TestimonialType,
} from "@prisma/client";
import cuid from "cuid";
import { useEffect } from "react";

type Props = {
  warnings: ZodIssue[];
  freelancer:
    | (Freelancer & {
        educations: EducationType[];
        employments: Employment[];
        skills: Skill[];
        testimonials: TestimonialType[];
      })
    | null;
};
const Achievement = ({ warnings, freelancer }: Props) => {
  const fields = stores.freelancer.base((state) => state.fields);

  const mergeFields = stores.freelancer.base((state) => state.mergeFields);

  useEffect(() => {
    if (freelancer?.educations) {
      mergeFields.educations(
        freelancer.educations.map((education) => {
          return {
            from: {
              id: cuid(),
              name: education.from,
            },
            to: {
              id: cuid(),
              name: education.to,
            },
            school: education.school,
            degree: {
              id: cuid(),
              name: education.degree,
            },
            area: {
              id: cuid(),
              name: education.area,
            },
          };
        })
      );
    }

    if (freelancer && freelancer.testimonials) {
      mergeFields.testimonials(
        freelancer.testimonials.map((testimonial) => ({
          name: testimonial.name,
          message: testimonial.message,
          email: testimonial.email,
          position: testimonial.position,
        }))
      );
    }
  }, []);

  const modalEducation = useModal();
  const modalTestimonial = useModal();

  return (
    <form className="space-y-4">
      <Field.Body
        id="education"
        label="Education"
        description="Describe your educational background. It will help clients get to know you!"
        tooltip="Describe your educational background. It will help clients get to know you!">
        <Button onClick={modalEducation.handleOpen}>Add Education</Button>
        {fields.educations.length ? (
          <ul className="grid grid-cols-5 gap-4">
            {fields.educations.map((education, index) => (
              <Card
                key={index}
                title={education.school}
                subtitle={`${education.from.name} - ${education.to.name}`}
                removeHandler={() => {
                  const updatedEducations = [...fields.educations];
                  mergeFields.educations(updatedEducations.slice(index + 1, 1));
                }}
              />
            ))}
          </ul>
        ) : null}
        <Education modal={modalEducation} />
      </Field.Body>
      <Field.Body
        id="testimonial"
        label="Testimonial"
        description="Share us all the testimonials you receive. This will take an advantage to the client's."
        tooltip="Share us all the testimonials you receive. This will take an advantage to the client's.">
        <Button onClick={modalTestimonial.handleOpen}>Add Testimonial</Button>
        {fields.testimonials.length ? (
          <ul className="grid grid-cols-5 gap-4">
            {fields.testimonials.map((testimonial, index) => (
              <Card
                key={index}
                title={testimonial.name}
                subtitle={testimonial.position}
                removeHandler={() => {
                  const updatedTestimonials = [...fields.testimonials];
                  mergeFields.testimonials(
                    updatedTestimonials.slice(index + 1, 1)
                  );
                }}
              />
            ))}
          </ul>
        ) : null}
        <Testimonial modal={modalTestimonial} />
      </Field.Body>
    </form>
  );
};

export default Achievement;
