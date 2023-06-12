import Gigs from "@core/components/sections/gigs";
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

type Props = {
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

const MyGigs = ({ freelancer }: Props) => {
  if (!freelancer?.gigs) return <>No Gigs</>;

  return <Gigs data={freelancer?.gigs} />;
};

export default MyGigs;
