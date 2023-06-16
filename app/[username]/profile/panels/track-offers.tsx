import Avatar from "@core/components/elements/avatar";
import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Text from "@core/components/elements/field/text";
import Modal from "@core/components/layouts/modal";
import useModal from "@core/hooks/use-modal";
import validate from "@core/utilities/validate";
import schemas from "@core/validations/schemas";
import { Menu } from "@headlessui/react";
import {
  Category,
  Education,
  Employment,
  Freelancer,
  Gig,
  Offer,
  Review,
  Skill,
  Status,
  Technology,
  Testimonial,
  Thumbnail,
  User,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { ZodIssue } from "zod";

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

const TrackOffers = ({ user, freelancer }: Props) => {
  console.log(user);
  const [selectedGig, setSelectedGig] = useState(freelancer?.gigs[0]);
  const [warnings, setWarnings] = useState<ZodIssue[]>([]);
  const sendReview = useModal();
  const [reviewFields, setReviewFields] = useState({
    message: "",
    rating: 0,
  });
  const router = useRouter();

  const handleUpdateOfferStatus = async (offerId: string, status: Status) => {
    await fetch("/api/offer/update-status", {
      method: "PUT",
      body: JSON.stringify({
        id: offerId,
        status: status,
      }),
    });
    router.refresh();
  };

  const handleCreateReview = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const result = schemas.review.safeParse(reviewFields);
    if (result.success) {
      try {
        await fetch(`/api/gigs/${selectedGig?.id}/create-review`, {
          method: "POST",
          body: JSON.stringify({
            message: reviewFields.message,
            rating: reviewFields.rating,
            gigId: selectedGig?.id,
            userId: user?.id,
          }),
        });
        setReviewFields({ message: "", rating: 0 });
        setWarnings([]);
        sendReview.handleClose();
        router.refresh();
      } catch (error) {
        console.log(error);
      }
    } else {
      setWarnings(result.error.issues);
    }
  };

  return (
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
              <Avatar src={offer.user.image!} alt="profile" size="small" />
              <h6>{offer.user.name}</h6>
            </div>

            {offer.status !== "COMPLETED" ? (
              <Menu as="div" className="relative">
                <Menu.Button>
                  <Button>Update Status</Button>
                </Menu.Button>
                <Menu.Items className="absolute top-8 right-0 z-10 flex w-64 flex-col bg-white shadow-lg">
                  {Object.values(Status)
                    .filter((status) => status !== "COMPLETED")
                    .map((status: any) => (
                      <Menu.Item key={status} as={Fragment}>
                        <button
                          className="px-4 py-3 hover:bg-primary-dark hover:text-white"
                          onClick={() =>
                            handleUpdateOfferStatus(offer.id, status)
                          }>
                          {status}
                        </button>
                      </Menu.Item>
                    ))}
                </Menu.Items>
              </Menu>
            ) : null}
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

            {offer.status === "DELIVERED" ? (
              <Button
                className="w-fit"
                onClick={() => handleUpdateOfferStatus(offer.id, "COMPLETED")}>
                Set as Completed
              </Button>
            ) : null}

            {offer.status === "COMPLETED" ? (
              <Button
                className="w-fit"
                onClick={() => {
                  sendReview.handleOpen();
                  //@ts-ignore
                  setSelectedGig(offer.gig);
                }}>
                Send Feedback
              </Button>
            ) : null}
          </div>
        ))}

      <Modal
        title="Send Feedback: Details"
        description="How satisfied are you in your freelancer's work? Send us a Feedback!"
        state={sendReview.state}
        handleClose={sendReview.handleClose}
        className="z-[999] max-w-5xl">
        <form className="space-y-4">
          <Field.Body id="message" label="Title" description="Gig Information">
            <Text id="title" isDisabled value={selectedGig?.title} isFull />
          </Field.Body>
          <Field.Body
            id="message"
            label="Message"
            warning={validate(warnings, "message")}
            description="What is your review?">
            <Field.Textarea
              id="message"
              isFull
              placeholder="Your Review here"
              value={reviewFields.message}
              onChange={(event) =>
                setReviewFields({
                  ...reviewFields,
                  message: event.target.value,
                })
              }
            />
          </Field.Body>

          <Field.Body
            id="rating"
            label="Rating"
            warning={validate(warnings, "rating")}
            description="How many will you rate this freelancer?">
            <Field.Number
              id="rating"
              isFull
              value={reviewFields.rating}
              onChange={(event) =>
                setReviewFields({
                  ...reviewFields,
                  rating: +event.target.value,
                })
              }
            />
          </Field.Body>
          <Button onClick={handleCreateReview}>Post Review</Button>
        </form>
      </Modal>
    </>
  );
};

export default TrackOffers;
