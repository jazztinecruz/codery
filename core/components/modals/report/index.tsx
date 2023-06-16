"use client";

import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Modal from "@core/components/layouts/modal";
import useModal from "@core/hooks/use-modal";
import { useState } from "react";

type Props = {
  userId: string;
};

const Report = ({ userId }: Props) => {
  const modal = useModal();

  const [fields, setFields] = useState({
    reason: "",
  });

  const handleSubmit = async () => {
    await fetch('/api/report', {
      method: "PUT",
      body: JSON.stringify({ userId: userId }),
    });
    setFields({...fields,reason: ""});
    modal.handleClose();
  };

  return (
    <>
      <Button onClick={modal.handleOpen} variant="secondary" className="h-fit">
        Report User
      </Button>

      <Modal
        title="Report Suspicious Account"
        description="Help us find the suspicous accounts by reporting to us."
        state={modal.state}
        handleClose={modal.handleClose}
        className="z-[999] max-w-5xl">
        <Field.Body
          id="reason"
          label="Reason"
          description="State your reason why we should suspend this user.">
          <Field.Textarea
            id="reason"
            isFull
            value={fields.reason}
            onChange={(event) =>
              setFields({ ...fields, reason: event.target.value })
            }
          />
        </Field.Body>

        <div className="flex w-full gap-4">
          <Button onClick={handleSubmit}>Submit Report</Button>
          <Button
            variant="tertiary"
            onClick={modal.handleClose}
            className="ml-auto">
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Report;
