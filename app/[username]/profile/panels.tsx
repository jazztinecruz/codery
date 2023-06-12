"use client";

import Avatar from "@core/components/elements/avatar";
import Badge from "@core/components/elements/badge";
import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Text from "@core/components/elements/field/text";
import Gigs from "@core/components/sections/gigs";
import Modal from "@core/components/layouts/modal";
import useModal from "@core/hooks/use-modal";
import validate from "@core/utilities/validate";
import schemas from "@core/validations/schemas";
import { Menu, Tab } from "@headlessui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
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
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { ZodIssue } from "zod";

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
      show: session?.user?.email === user?.email ?? false,
    },
    { title: "Freelancer Details", show: freelancer ?? false },
    {
      title: "Manage Gigs",
      show: (session?.user?.email === user?.email && freelancer) ?? false,
    },
    {
      title: "Track Offers",
      show: session?.user?.email === user?.email ?? false,
    },
    { title: "Gigs", show: freelancer ?? false },
  ];

  const [selectedGig, setSelectedGig] = useState(freelancer?.gigs[0]);
  const initialFields = {
    title: selectedGig ?? "",
    description: selectedGig?.description ?? "",
    from: selectedGig?.from ?? 0,
    to: selectedGig?.to ?? 0,
    period: selectedGig?.period ?? 0,
  };

  const [editFields, setEditFields] = useState(initialFields);
  const [username, setUsername] = useState(user?.username ? user.username : "");
  const [reviewFields, setReviewFields] = useState({
    message: "",
    rating: 0,
  });
  const [warnings, setWarnings] = useState<ZodIssue[]>([]);
  const editGigModal = useModal();
  const sendReview = useModal();
  const editUsernameModal = useModal();
  const router = useRouter();

  const handleDeleteGig = async (id: string) => {
    try {
      const response = await fetch(`/api/gigs/${id}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to delete gig");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditGig = async () => {
    try {
      await fetch(`/api/gigs/${selectedGig?.id}/edit`, {
        method: "PUT",
        body: JSON.stringify({
          id: selectedGig?.id,
          title: editFields.title,
          description: editFields.description,
          from: +editFields.from,
          to: +editFields.to,
          revision: +editFields.period,
        }),
      });
      editGigModal.handleClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleEditUsername = async () => {
    await fetch("/api/user/edit-username", {
      method: "PUT",
      body: JSON.stringify({
        id: user?.id,
        username: username,
      }),
    });
    router.refresh()
    router.push('/')
    editUsernameModal.handleClose();
  };

  return (
    <section className="contain space-y-4">
      <Tab.Group as="div" className="flex w-full gap-6">
        <Tab.List className="flex h-fit flex-col border bg-white">
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
                } w-full whitespace-nowrap border-b px-4 py-2.5 text-left text-sm font-medium leading-5 outline-none`
              }>
              {panel.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels as="div" className="w-full">
          <Tab.Panel>
            <section className="mb-2 flex flex-wrap gap-3">
              <div className="flex flex-col">
                <h1 className="mb-2 font-semibold">Name</h1>
                <div className="flex w-fit flex-col flex-wrap gap-1 rounded border bg-white py-3 px-6">
                  {user?.name}
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="mb-2 font-semibold">Email Address</h1>
                <div className="flex w-fit flex-col gap-1 rounded border bg-white py-3 px-6">
                  {user?.email}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="font-semibold">Username</h1>
                  <PencilSquareIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={editUsernameModal.handleOpen}
                  />
                </div>
                <div className="flex w-fit flex-col gap-1 rounded border bg-white py-3 px-6">
                  {user?.username ? user.username : ""}
                </div>

                <Modal
                  state={editUsernameModal.state}
                  handleClose={editUsernameModal.handleClose}
                  title="Edit Your Username">
                  <Field.Body
                    id="username"
                    label="Username"
                    description="What do you want to be your username?">
                    <Field.Text
                      id="username"
                      isFull
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </Field.Body>
                  <Button onClick={handleEditUsername}>Save Changes</Button>
                </Modal>
              </div>
            </section>
          </Tab.Panel>

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
                    <PencilSquareIcon
                      className="h-5 w-5"
                      onClick={() => {
                        setSelectedGig(gig);
                        editGigModal.handleOpen();
                      }}
                    />
                    <TrashIcon
                      className="h-5 w-5 text-red-500"
                      onClick={() => handleDeleteGig(gig.id)}
                    />
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
                        onClick={() => {
                          sendReview.handleOpen();
                          //@ts-ignore
                          setSelectedGig(offer.gig);
                        }}>
                        Send Review
                      </Button>
                    ) : null}
                  </div>
                ))}
            </>
          </Tab.Panel>

          <Tab.Panel>
            {/* @ts-ignore */}
            <Gigs data={freelancer?.gigs} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

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

      <Modal
        title="Edit Gig: Details"
        description="You can edit your gig information here."
        state={editGigModal.state}
        handleClose={editGigModal.handleClose}
        className="z-[999] max-w-5xl">
        <div className="z-[999] grid gap-8 laptop:grid-cols-2">
          <Field.Body
            id="title"
            label="Title"
            description="State your Gig Title">
            <Field.Text
              id="title"
              isFull
              defaultValue={selectedGig?.title}
              onChange={(event) =>
                setEditFields({ ...editFields, title: event.target.value })
              }
            />
          </Field.Body>

          <Field.Body
            id="description"
            label="Description"
            description="State your Gig Description">
            <Field.Textarea
              id="description"
              isFull
              defaultValue={selectedGig?.description}
              onChange={(event) =>
                setEditFields({
                  ...editFields,
                  description: event.target.value,
                })
              }
            />
          </Field.Body>

          <Field.Body
            id="from"
            label="From"
            description="State your Starting Price">
            <Field.Number
              id="from"
              isFull
              defaultValue={selectedGig?.from}
              onChange={(event) =>
                setEditFields({ ...editFields, from: +event.target.value })
              }
            />
          </Field.Body>

          <Field.Body id="to" label="to" description="State your Maximum Price">
            <Field.Number
              id="to"
              isFull
              defaultValue={selectedGig?.to}
              onChange={(event) =>
                setEditFields({ ...editFields, to: +event.target.value })
              }
            />
          </Field.Body>

          <Field.Body
            id="period"
            label="Revision"
            description="State your Days of Revision">
            <Field.Number
              id="period"
              isFull
              defaultValue={selectedGig?.period}
              onChange={(event) =>
                setEditFields({ ...editFields, period: +event.target.value })
              }
            />
          </Field.Body>
        </div>

        <div className="flex w-full gap-4">
          <Button onClick={handleEditGig}>Save Changes</Button>
          <Button
            variant="secondary"
            onClick={() => setEditFields(initialFields)}>
            Clear
          </Button>
          <Button
            variant="tertiary"
            onClick={editGigModal.handleClose}
            className="ml-auto">
            Close
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default Panels;
