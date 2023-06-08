import React from "react";
import { useState, useEffect, useRef } from "react";
import facade from "../../ApiFacade";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { Listbox, Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function Boats() {
  const navigate = useNavigate();
  const [boats, setBoats] = useState([]);
  const [open, setOpen] = useState(false);
  const [boat, setBoat] = useState({
    brand: "",
    make: "",
    image: "",
  });
  const [selectedHarbour, setSelectedHarbour] = useState(null);
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [harbours, setHarbours] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [modalOpener, setModalOpener] = useState(false);

  const [openAddOwnerModal, setOpenAddOwnerModal] = useState(false);
  const [openEditBoatModal, setOpenEditBoatModal] = useState(false);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const cancelButtonRef = useRef(null);
  //handle delete
  function handleDelete(id) {
    facade.deleteBoat(id);
    window.location.reload();
  }

  function handleSubmit(e) {
    e.preventDefault();
    facade.createBoat(boat);
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    facade.fetchAllBoats().then((data) => {
      setBoats(data);
    });
  }, []);

  useEffect(() => {
    facade.fetchHarbour().then((data) => {
      setHarbours(data);
      setSelectedHarbour(data[0]);
    });
  }, []);

  useEffect(() => {
    facade.getOwners().then((data) => {
      setOwners(data);
      setSelectedOwner(data[0]);
    });
  }, []);

  function handleChange(e) {
    setBoat({
      ...boat,
      [e.target.name]: e.target.value,
    });
  }

  function handleSearch(e) {
    setSearchInput(e.target.value);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    facade.editBoat(selectedBoat.id, boat);
  }

  function clickingEditButton(e) {
    setOpenEditBoatModal(true);
    setSelectedBoat(e);
  }

  return (
    <Fragment>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Boats</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all boats.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setOpen(true)}
          >
            Add boat
          </button>
        </div>
      </div>
      <form>
        <div className="flex gap-2">
          <input onChange={handleSearch} className="px-3 py-2 border rounded w-full" placeholder="Search for boat brand" />
        </div>
      </form>
      {boats.length === 0 && (
        <div className="mt-10">
          <p className="text-center text-gray-500">No boats found</p>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Photo
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Harbour
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Owners
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {boats
                  .filter((boat) => (searchInput.toLowerCase() === "" ? boat.brand.toLowerCase() : boat.brand.toLowerCase().includes(searchInput.toLowerCase())))
                  .map((boat) => (
                    <tr key={boat.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{boat.brand}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{boat.make}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <img src={boat.image} alt="" />
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {boat.harbour ? (
                          boat.harbour
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBoat(boat);
                              setModalOpener(true);
                            }}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Add Harbour
                          </button>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-1 py-1 text-sm text-gray-500">
                        <div className="flex flex-col">
                          {boat.owner && boat.owner.map((data) => <span key={data.id}>{data.name}</span>)}
                          <div>
                            <button
                              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              onClick={() => {
                                setSelectedBoat(boat);
                                setOpenAddOwnerModal(true);
                              }}
                            >
                              Add owner
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => {
                            clickingEditButton(boat);
                          }}
                          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            handleDelete(boat.id);
                          }}
                          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide over */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">New Boat</Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button type="button" className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setOpen(false)}>
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-300">Fill in the information about the boat you wanna create.</p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Boat brand</label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="brand"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Boat make</label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="make"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Boat image</label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="image"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button type="button" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => setOpen(false)}>
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={handleSubmit}
                        >
                          Create Boat
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Modal opener for adding harbour */}

      <Transition.Root show={modalOpener} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setModalOpener(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <Listbox value={selectedHarbour} onChange={setSelectedHarbour}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">{harbours && harbours.length > 0 ? <span className="ml-3 block truncate">{selectedHarbour.name}</span> : "No harbours"}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>

                          <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {harbours.map((harbour) => (
                                <Listbox.Option key={harbour.id} className={({ active }) => classNames(active ? "bg-indigo-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")} value={harbour}>
                                  {({ selectedHarbour, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <span className={classNames(selectedHarbour ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{harbour.name}</span>
                                      </div>

                                      {selectedHarbour ? (
                                        <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setModalOpener(false);
                        facade.addBoatToHarbour(selectedBoat.id, selectedHarbour.id);
                      }}
                    >
                      Add Habour
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setModalOpener(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Add Owner Modal */}
      <Transition.Root show={openAddOwnerModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpenAddOwnerModal(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <Listbox value={selectedOwner} onChange={setSelectedOwner}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                              <span className="ml-3 block truncate">{selectedOwner.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>

                          <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {owners.map((owner) => (
                                <Listbox.Option key={owner.id} className={({ active }) => classNames(active ? "bg-indigo-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")} value={owner}>
                                  {({ selectedOwner, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <span className={classNames(selectedOwner ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{owner.name}</span>
                                      </div>

                                      {selectedHarbour ? (
                                        <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setOpenAddOwnerModal(false);
                        facade.addBoatToHarbour(selectedBoat.id, selectedHarbour.id);
                      }}
                    >
                      Add Habour
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpenAddOwnerModal(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Slide over for editing  */}

      <Transition.Root show={openEditBoatModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenEditBoatModal}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">New Boat</Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button type="button" className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setOpen(false)}>
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-300">Fill in the information to change the boats info.</p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Boat brand</label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="brand"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Boat make</label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="make"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Boat image</label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="image"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button type="button" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => setOpenEditBoatModal(false)}>
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={handleEditSubmit}
                        >
                          Create Boat
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
