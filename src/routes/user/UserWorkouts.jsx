import React, { Fragment, useEffect, useState, useRef } from "react";
import facade from "../../ApiFacade";
import { Dialog, Transition } from "@headlessui/react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function Workouts({ username }) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [input, setInput] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState({});
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [image, setImage] = useState("");
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [workoutAlreadyAdded, setWorkoutAlreadyAdded] = useState(false);

  function handleChange(e) {
    setInput(e.target.value);
  }

  useEffect(() => {
    facade.fetchWorkoutsByUsername(username).then((data) => setUserWorkouts(data));
  }, [selectedWorkout]);

  function handleSubmit(e) {
    e.preventDefault();
    facade.fetchWorkout(input).then((data) => {
      // if workouts consists of workouts with the same name, filter them out
      const filteredWorkouts = data.filter((workout, index, self) => self.findIndex((w) => w.name === workout.name) === index);
      setWorkouts(filteredWorkouts);
    });
  }

  function handleSelectWorkout(id) {
    // get the selected workout from the workouts array
    const workout = workouts.find((workout) => workout.id === id);

    // check if the workout is already added
    if (userWorkouts.find((userWorkout) => userWorkout.id === workout.id)) {
      setWorkoutAlreadyAdded(true);
    } else {
      setWorkoutAlreadyAdded(false);
    }

    // set the selected workout
    setSelectedWorkout(workout);

    // set the muscle groups
    const muscleGroups = new Set();
    workout.exercisesList.forEach((exercise) => muscleGroups.add(exercise.muscle.toLowerCase()));
    setMuscleGroups(Array.from(muscleGroups));

    // convert the muscle groups to a string
    const muscleGroupsString = Array.from(muscleGroups).join(",");

    // set the image
    facade.generatePhoto(muscleGroupsString).then((data) => setImage(data));

    setOpen(true);
  }

  function handleAddWorkout() {
    facade.linkWorkoutToUser(username, selectedWorkout);
    // add the workout to the userWorkouts array
    setUserWorkouts([...userWorkouts, selectedWorkout]);
    setWorkoutAlreadyAdded(true);
  }

  return (
    <Fragment>
      <form>
        <div className="flex gap-2">
          <input onChange={handleChange} className="px-3 py-2 border rounded w-full" placeholder="Search by muscle group" />
          <button type="submit" className="btn bg-indigo-600 text-white px-3 py-2 rounded" onClick={handleSubmit}>
            Search
          </button>
        </div>
      </form>

      {workouts.length === 0 && (
        <div className="mt-10">
          <p className="text-center text-gray-500">No workouts found</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mt-10">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{workout.name}</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:px-6">
                  <button className="text-sm font-medium text-gray-500" onClick={() => handleSelectWorkout(workout.id)}>
                    View more
                  </button>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => {
            setOpen(false);
            setSelectedWorkout({});
            setMuscleGroups([]);
          }}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="text-center">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {selectedWorkout.name}
                      </Dialog.Title>
                      <div className="mt-4">
                        <div className="grid grid-cols-2">
                          <div>
                            <p className="text-sm text-gray-500 font-bold">Exercises</p>
                            <ul>
                              {selectedWorkout.exercisesList?.map((exercise) => (
                                <li key={exercise.id} className="text-sm text-gray-500">
                                  {exercise.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-bold">Muscle groups</p>
                            <ul>
                              {muscleGroups.map((muscle) => (
                                <li key={muscle} className="text-sm text-gray-500">
                                  {muscle}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {image && <img src={image} alt="workout" />}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    {!workoutAlreadyAdded ? (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={handleAddWorkout}
                      >
                        Add to list
                      </button>
                    ) : (
                      <button
                        disabled
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={handleAddWorkout}
                      >
                        <CheckBadgeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Already added
                      </button>
                    )}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => {
                        setOpen(false);
                        setSelectedWorkout({});
                        setMuscleGroups([]);
                      }}
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
    </Fragment>
  );
}
