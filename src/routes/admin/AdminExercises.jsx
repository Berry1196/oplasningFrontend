import facade from "../../ApiFacade";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { LinkIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [exerciseInstructions, setExerciseInstructions] = useState("");
  const [newExercise, setNewExercise] = useState({
    name: "",
    type: "",
    muscle: "",
    equipment: "",
    difficulty: "",
    instructions: "",
  });

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    facade.getExercises().then((data) => setExercises(data));
  }, []);

  function handleChange(e) {
    setNewExercise({ ...newExercise, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    facade.createExercise(newExercise).then((data) => {
      setExercises([...exercises, data]);
    });
    setOpen(false);
  }

  function handleDelete(id) {
    facade.deleteExercise(id).then(() => {
      setExercises(exercises.filter((exercise) => exercise.id !== id));
    });
  }

  return (
    <Fragment>
      {/* BELOW SEARCH FIELD */}

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Exercises</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the exercises in the database including their name, type, muscle, equipment and difficulty.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setOpen(true)}
          >
            Add exercise
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-gray-300 sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Muscle
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Equipment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Difficulty
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Instructions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {exercises.map((exercise) => (
                    <tr key={exercise.name}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{exercise.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exercise.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exercise.muscle}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exercise.equipment}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exercise.difficulty}</td>
                      {/* print 20 characters of instructions in td */}
                      <td
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setExerciseInstructions(exercise.instructions);
                        }}
                      >
                        View more
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <p className="text-red-600 hover:text-red-900 hover:cursor-pointer" onClick={() => handleDelete(exercise.id)}>
                          Delete exercise
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* EXERCISE INSTRUCTIONS MODAL */}
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Exercise Instructions
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{exerciseInstructions}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setOpenModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* CREATE NEW WORKOUT SLIDE-IN */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

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
                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" onSubmit={handleSubmit}>
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">New exercise</Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-300">Get started by filling in the information below to create your new exercise.</p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                  Exercise name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="e.g. Squats"
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                                  Type of exercise
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="type"
                                    id="type"
                                    placeholder="e.g. Strength"
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="muscle" className="block text-sm font-medium leading-6 text-gray-900">
                                  Muscle group
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="muscle"
                                    id="muscle"
                                    placeholder="e.g. Legs"
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="equipment" className="block text-sm font-medium leading-6 text-gray-900">
                                  Equipment used
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="equipment"
                                    id="equipment"
                                    placeholder="e.g. Barbell"
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium leading-6 text-gray-900">
                                  Difficulty
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="difficulty"
                                    id="difficulty"
                                    placeholder="e.g. Beginner"
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="instructions" className="block text-sm font-medium leading-6 text-gray-900">
                                  Instructions
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id="instructions"
                                    name="instructions"
                                    rows={4}
                                    maxLength={255}
                                    placeholder="e.g. Stand with your feet shoulder-width apart. Lower your body until your thighs are parallel to the floor. Pause, then push yourself back up to the starting position."
                                    className="block w-full rounded-md px-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                    defaultValue={""}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Save
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
