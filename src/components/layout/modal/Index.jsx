import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({ open, setOpen, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Modal.Title = function Title({ children }) {
  return (
    <Dialog.Title
      as="h3"
      className="text-base font-semibold leading-6 text-gray-900"
    >
      {children}
    </Dialog.Title>
  );
};

Modal.Content = function Content({ children }) {
  return <div className="mt-2 text-sm text-gray-500">{children}</div>;
};

Modal.Footer = function Footer({ children }) {
  return <div className="mt-5 sm:mt-6">{children}</div>;
};

Modal.Container = function Container({ children }) {
  return <div className="mt-3 text-center sm:mt-5">{children}</div>;
};
