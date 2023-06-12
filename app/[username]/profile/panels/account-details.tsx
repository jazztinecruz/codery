import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import Modal from "@core/components/layouts/modal";
import useModal from "@core/hooks/use-modal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Freelancer, Gig, Offer, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Container from "./container";

type Props = {
  user:
    | (User & {
        offers: (Offer & {
          gig: Gig;
          freelancer: Freelancer & { user: User };
        })[];
      })
    | null;
};

const AccountInformation = ({ user }: Props) => {
  if (!user) return null;

  const [username, setUsername] = useState(user?.username ? user.username : "");
  const editUsernameModal = useModal();
  const router = useRouter();

  const handleEditUsername = async () => {
    await fetch("/api/user/edit-username", {
      method: "PUT",
      body: JSON.stringify({
        id: user?.id,
        username: username,
      }),
    });
    router.refresh();
    router.push("/");
    editUsernameModal.handleClose();
  };

  return (
    <>
      <section className="mb-2 flex flex-wrap gap-3">
        <Container label="Name">{user.name}</Container>
        <Container label="Email Address">{user.email}</Container>
        <Container label="Username">
          <div className="flex items-center gap-3">
            {user?.username ? user.username : ""}
            <PencilSquareIcon
              className="h-5 w-5 cursor-pointer"
              onClick={editUsernameModal.handleOpen}
            />
          </div>
        </Container>
      </section>

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
    </>
  );
};

export default AccountInformation;
