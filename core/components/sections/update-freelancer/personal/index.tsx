import Field from "@core/components/elements/field";
import stores from "@core/stores";
import validate from "@core/utilities/validate";
import {
  Education,
  Employment,
  Freelancer,
  Skill,
  Testimonial,
  User,
} from "@prisma/client";
import { useEffect } from "react";
import { ZodIssue } from "zod";

type Props = {
  warnings: ZodIssue[];
  user: User;
  freelancer:
    | (Freelancer & {
        educations: Education[];
        employments: Employment[];
        skills: Skill[];
        testimonials: Testimonial[];
      })
    | null;
};

const Personal = ({ warnings, user, freelancer }: Props) => {
  const fields = stores.freelancer.base((state) => state.fields);
  const setFields = stores.freelancer.base((state) => state.setFields);
  const mergeFields = stores.freelancer.base((state) => state.mergeFields);

  useEffect(() => {
    mergeFields.biography(user.biography ?? "");
    mergeFields.location(user.location ?? "");
    mergeFields.phone(user.phone || "");
  }, []);

  return (
    <form className="space-y-4">
      <Field.Body
        id="biography"
        label="Biography"
        description="Tell me about yourself."
        tooltip="Tell us about yourself. Clients are also interested in learning about you as a person."
        warning={validate(warnings, "biography")}>
        <Field.Textarea
          id="biography"
          isFull
          placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate, soluta explicabo qui quidem, suscipit doloremque voluptas perspiciatis dicta optio nam temporibus minus aliquid voluptatum ratione corporis est laboriosam? Mollitia, non!"
          value={fields.biography}
          onChange={setFields.biography}
        />
      </Field.Body>
      <div className="grid grid-cols-2 gap-8">
        <Field.Body
          id="location"
          label="Country"
          description="Where do you live?"
          tooltip="State what country are you in. Clients are also interested in connecting with you as a person."
          warning={validate(warnings, "location")}>
          <Field.Text
            id="location"
            isFull
            placeholder="Philippines"
            value={fields.location}
            onChange={setFields.location}
          />
        </Field.Body>
        <Field.Body
          id="phone"
          label="Phone"
          description="State your Phone Number."
          tooltip="Clients can reach you through your mobile phone."
          warning={validate(warnings, "phone")}>
          <Field.Text
            id="phone"
            isFull
            placeholder="+63 123456789"
            value={fields.phone}
            onChange={setFields.phone}
          />
        </Field.Body>
      </div>
    </form>
  );
};

export default Personal;