"use client";

import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Modal from "@core/components/layouts/modal";
import useModal from "@core/hooks/use-modal";
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
  Technology,
  Testimonial,
  Thumbnail,
  User,
} from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

const ManageGigs = ({ freelancer }: Props) => {
  if (!freelancer?.gigs) return <>No Gigs</>;

  const editModal = useModal();
  const router = useRouter();
  const [selectedGig, setSelectedGig] = useState(freelancer?.gigs[0]);
  const initialFields = {
    title: selectedGig?.title ?? "",
    description: selectedGig?.description ?? "",
    from: selectedGig?.from ?? 0,
    to: selectedGig?.to ?? 0,
    period: selectedGig?.period ?? 0,
  };

  const [editFields, setEditFields] = useState(initialFields);

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
      const response = await fetch(`/api/gigs/${selectedGig?.id}/edit`, {
        method: "PUT",
        body: JSON.stringify({
          id: selectedGig?.id,
          title: editFields.title,
          description: editFields.description,
          from: editFields.from,
          to: editFields.to,
          period: editFields.period,
        }),
      });
      if (response.status === 200) {
        editModal.handleClose();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
                editModal.handleOpen();
              }}
            />
            <TrashIcon
              className="h-5 w-5 text-red-500"
              onClick={() => handleDeleteGig(gig.id)}
            />
          </div>
        </div>
      ))}

      <Modal
        title="Edit Gig: Details"
        description="You can edit your gig information here."
        state={editModal.state}
        handleClose={editModal.handleClose}
        className="z-[999] max-w-5xl">
        <div className="z-[999] grid gap-8 laptop:grid-cols-2">
          <Field.Body
            id="title"
            label="Title"
            description="State your Gig Title">
            <Field.Text
              id="title"
              isFull
              value={selectedGig?.title}
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
              value={selectedGig?.description}
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
            onClick={editModal.handleClose}
            className="ml-auto">
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ManageGigs;
