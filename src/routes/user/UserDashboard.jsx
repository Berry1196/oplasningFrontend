import facade from "../../ApiFacade";
import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Dashboard({ username }) {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [selectedWorkout, setSelectedWorkout] = useState({});
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [image, setImage] = useState("");
  const [localStorageWorkout, setLocalStorageWorkout] = useState(JSON.parse(localStorage.getItem("workout")) || {});

  function handleStartWorkout() {
    const sets = [
      { id: 1, completed: false },
      { id: 2, completed: false },
      { id: 3, completed: false },
      { id: 4, completed: false },
    ];

    // throw sets into selectedWorkout exercisesList
    selectedWorkout.exercisesList.forEach((exercise) => (exercise.sets = sets));

    if (selectedWorkout.id !== localStorageWorkout.id) {
      // set the workout in localStorage
      localStorage.setItem("workout", JSON.stringify(selectedWorkout));
    }

    window.location.href = "/activity";
  }

  function handleSelectWorkout(id) {
    // get the selected workout from the workouts array
    const workout = workouts.find((workout) => workout.id === id);

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

  useEffect(() => {
    facade.fetchWorkoutsByUsername(username).then((data) => setWorkouts(data));
  }, []);

  function handleRemoveWorkout(id) {
    facade.deleteWorkoutFromUser(username, id);
    window.location.reload();
  }

  return (
    <Fragment>
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
                  <div className="mt-5 sm:mt-6 flex gap-3 flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleStartWorkout}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveWorkout(selectedWorkout.id)}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                      Remove
                    </button>
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
