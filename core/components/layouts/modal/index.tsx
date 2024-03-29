"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { State } from "@core/types/modal";
import Balancer from "react-wrap-balancer";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  state: State;
  handleClose: () => void;
  className?: string;
};

const Modal = ({
  children,
  title,
  description,
  state,
  handleClose,
  className,
}: Props) => {
  return (
    <Transition appear show={state === "show" ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-primary-dark/10 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel
                className={`${
                  className ? className : ""
                } w-full space-y-4 rounded bg-primary-light p-8 shadow transition-all`}>
                {title || description ? (
                  <div className="space-y-1 rounded bg-primary-dark p-4">
                    {title ? (
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-extrabold text-primary-light">
                        {title}
                      </Dialog.Title>
                    ) : null}
                    {description ? (
                      <Balancer>
                        <p className="text-sm font-medium text-primary-light/fade">
                          {description}
                        </p>
                      </Balancer>
                    ) : null}
                  </div>
                ) : null}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
