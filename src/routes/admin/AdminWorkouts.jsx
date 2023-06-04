import facade from "../../ApiFacade";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminWorkout() {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [searchExercises, setSearchExercises] = useState([]);
  const [searchExercisesInput, setSearchExercisesInput] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedExercisesIds, setSelectedExercisesIds] = useState([]);

  useEffect(() => {
    facade.fetchWorkouts().then((data) => setWorkouts(data));
  }, []);

  useEffect(() => {
    facade.fetchExerciseByName(searchExercisesInput).then((data) => setSearchExercises(data));
  }, [searchExercisesInput]);

  // opens the slide-in
  function handleAddWorkout() {
    setOpen(true);
    facade.getExercises().then((data) => setSearchExercises(data));
  }

  function handleWorkoutNameInput(event) {
    setWorkoutName(event.target.value);
  }

  function handleSelectExercise(exercise) {
    // check if selectedExercises array contains exercise id already
    if (selectedExercises.includes(exercise.id)) {
      // if it does, remove it from the array
      setSelectedExercises(selectedExercises.filter((id) => id !== exercise.id));
    } else {
      // if it doesn't, add it to the array
      setSelectedExercises([...selectedExercises, exercise]);
    }

    // check if selectedExercisesIds array contains exercise id already
    if (selectedExercisesIds.includes(exercise.id)) {
      // if it does, remove it from the array
      setSelectedExercisesIds(selectedExercisesIds.filter((id) => id !== exercise.id));
    } else {
      // if it doesn't, add it to the array
      setSelectedExercisesIds([...selectedExercisesIds, exercise.id]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    facade.createWorkout({ name: workoutName, exercisesList: selectedExercises }).then((data) => {
      setWorkouts([...workouts, data]);
    });
    setOpen(false);
  }

  function handleSearchExercisesInput(event) {
    setSearchExercisesInput(event.target.value);
  }

  function handleDeleteWorkout(id) {
    facade.deleteWorkout(id).then(() => {
      setWorkouts(workouts.filter((workout) => workout.id !== id));
    });
  }

  return (
    <Fragment>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Workouts</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all the workouts in the database.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddWorkout}
          >
            Add workout
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
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Add to workout</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{workout.name}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a onClick={() => handleDeleteWorkout(workout.id)} className="text-red-600 hover:text-red-900 hover:cursor-pointer">
                          Delete workout
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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
                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-600 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">New Workout</Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md bg-indigo-600 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-300">Fill out the fields below and create a new workout.</p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="space-y-4 p-4 sm:p-6">
                            <div>
                              <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Name of workout
                              </label>
                              <div className="mt-2">
                                <input
                                  required
                                  type="text"
                                  name="project-name"
                                  id="name"
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="e.g. Push day"
                                  onChange={handleWorkoutNameInput}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">
                                Search exercises
                              </label>
                              <div className="relative mt-2 flex items-center">
                                <input
                                  type="text"
                                  name="search"
                                  id="search"
                                  placeholder="e.g. Bench press"
                                  onChange={handleSearchExercisesInput}
                                  className="block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="exercises" className="block text-sm font-medium leading-6 text-gray-900">
                                Exercises {selectedExercisesIds.length > 0 && `(${selectedExercisesIds.length})`}
                              </label>
                              <div className="mt-2">
                                <ul className="border border-gray-300 rounded-md divide-y divide-gray-300">
                                  {searchExercises.map((exercise) => (
                                    <li key={exercise.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                      <div className="w-0 flex-1 flex items-center">
                                        <span className="ml-2 flex-1 w-0 truncate">{exercise.name}</span>
                                      </div>
                                      <div className="ml-4 flex-shrink-0">
                                        {selectedExercisesIds.includes(exercise.id) ? (
                                          <button
                                            type="button"
                                            className="rounded-md px-2 py-1 text-sm font-semibold text-white shadow-sm bg-indigo-600 ring-1 ring-indigo-600 hover:bg-indigo-700"
                                            onClick={() => handleSelectExercise(exercise)}
                                          >
                                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            className="rounded-md px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm bg-white ring-1 ring-gray-300 hover:bg-gray-50"
                                            onClick={() => handleSelectExercise(exercise)}
                                          >
                                            <PlusIcon className="h-4 w-4" aria-hidden="true" />
                                          </button>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
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
                          onClick={handleSubmit}
                        >
                          Create workout
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
