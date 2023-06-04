import React, { Fragment, useEffect, useState } from "react";

export default function Activity() {
  const [workout, setWorkout] = useState(JSON.parse(localStorage.getItem("workout")) || null);
  const [activeExercise, setActiveExercise] = useState({});
  const [sets, setSets] = useState([]);

  useEffect(() => {
    // sets the active exercise & sets to the first exercise in the workout
    if (workout !== null) {
      setActiveExercise(workout.exercisesList[0]);
      setSets(workout.exercisesList[0].sets);
    }
  }, []);

  useEffect(() => {
    if (workout !== null) {
      // set the workout in localStorage
      localStorage.setItem("workout", JSON.stringify(workout));
    }
  }, [workout]);

  // controls the selection of sets
  function handleSelectSet(set) {
    // get the index of the selected set
    const index = sets.findIndex((s) => s.id === set.id);

    // if the set is not completed, set it to completed
    if (set.completed === false) {
      // change the set to completed in the workout state
      workout.exercisesList.forEach((exercise) => {
        if (exercise.id === activeExercise.id) {
          setSets((prevSets) => {
            const newSets = [...prevSets];
            newSets[index].completed = true;
            return newSets;
          });
        }
      });
    } else {
      // change the set to not completed in the workout state
      workout.exercisesList.forEach((exercise) => {
        if (exercise.id === activeExercise.id) {
          setSets((prevSets) => {
            const newSets = [...prevSets];
            newSets[index].completed = false;
            return newSets;
          });
        }
      });
    }

    // finally, update workout state with the updated sets
    setWorkout((prevWorkout) => {
      const newWorkout = { ...prevWorkout };
      newWorkout.exercisesList.forEach((exercise) => {
        if (exercise.id === activeExercise.id) {
          exercise.sets = sets;
        }
      });
      return newWorkout;
    });
  }

  // controls the selection of next exercise
  function handleSelectNextExercise() {
    // get the index of the active exercise
    const index = workout.exercisesList.findIndex((exercise) => exercise.id === activeExercise.id);

    // if the index is not the last index, set the next exercise as the active exercise
    if (index !== workout.exercisesList.length - 1) {
      setActiveExercise(workout.exercisesList[index + 1]);
    }

    // set the sets
    setSets(workout.exercisesList[index + 1].sets);
  }

  // controls the selection of previous exercise
  function handleSelectPreviousExercise() {
    // get the index of the active exercise
    const index = workout.exercisesList.findIndex((exercise) => exercise.id === activeExercise.id);

    // if the index is not the first index, set the previous exercise as the active exercise
    if (index !== 0) {
      setActiveExercise(workout.exercisesList[index - 1]);
    }

    // set the sets
    setSets(workout.exercisesList[index - 1].sets);
  }

  // mark as complete
  function handleMarkAsComplete() {
    if (sets.every((set) => set.completed === true)) {
      // set all sets in the active exercise to not completed
      workout.exercisesList.forEach((exercise) => {
        if (exercise.id === activeExercise.id) {
          setSets((prevSets) => {
            const newSets = [...prevSets];
            newSets.forEach((set) => {
              set.completed = false;
            });
            return newSets;
          });
        }
      });
      // finally, update workout state with the updated sets
      setWorkout((prevWorkout) => {
        const newWorkout = { ...prevWorkout };
        newWorkout.exercisesList.forEach((exercise) => {
          if (exercise.id === activeExercise.id) {
            exercise.sets = sets;
          }
        });
        return newWorkout;
      });
    } else {
      // set all sets in the active exercise to completed
      workout.exercisesList.forEach((exercise) => {
        if (exercise.id === activeExercise.id) {
          setSets((prevSets) => {
            const newSets = [...prevSets];
            newSets.forEach((set) => {
              set.completed = true;
            });
            return newSets;
          });
        }
      });
      // finally, update workout state with the updated sets
      setWorkout((prevWorkout) => {
        const newWorkout = { ...prevWorkout };
        newWorkout.exercisesList.forEach((exercise) => {
          if (exercise.id === activeExercise.id) {
            exercise.sets = sets;
          }
        });
        return newWorkout;
      });
    }
  }

  function handleCompleteWorkout() {
    window.location.href = "/";
  }

  return (
    <Fragment>
      <h1 className="text-center text-2xl font-bold">{activeExercise ? activeExercise.name : null}</h1>
      <p className="text-center text-base text-gray-500">
        {workout ? workout.exercisesList.findIndex((exercise) => exercise.id === activeExercise.id) + 1 : null} of{" "}
        {workout ? workout.exercisesList.length : null}
      </p>
      <ul className="border border-gray-300 rounded-md divide-y divide-gray-300 mt-10">
        {sets.map((set) => (
          <li key={set.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
            <div className="w-0 flex-1 flex items-center">
              <span className="ml-2 flex-1 w-0 truncate">
                Set {set.id}: <span className="text-gray-400">12 reps</span>
              </span>
            </div>
            <div className="ml-4 flex-shrink-0">
              {set.completed === true ? (
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm font-semibold text-white shadow-sm bg-indigo-600 ring-1 ring-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleSelectSet(set)}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm bg-white ring-1 ring-gray-300 hover:bg-gray-50"
                  onClick={() => handleSelectSet(set)}
                >
                  Finish
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {workout && workout.exercisesList[0].id === activeExercise.id ? (
          <button type="button" disabled className="rounded-md px-3 py-2 text-sm font-semibold text-gray-50 bg-gray-50">
            Previous exercise
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSelectPreviousExercise}
            className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm bg-white ring-1 ring-gray-300 hover:bg-gray-50 hover:cursor-pointer"
          >
            Previous exercise
          </button>
        )}
        {sets && sets.every((set) => set.completed === true) ? (
          <button
            type="button"
            onClick={handleMarkAsComplete}
            className="rounded-md px-2 py-1 text-sm font-semibold text-white shadow-sm bg-indigo-500 ring-1 ring-indigo-500 hover:bg-indigo-600 hover:ring-indigo-600 hover:cursor-pointer"
          >
            Unmark
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMarkAsComplete}
            className="rounded-md px-2 py-1 text-sm font-semibold text-white shadow-sm bg-indigo-500 ring-1 ring-indigo-500 hover:bg-indigo-600 hover:ring-indigo-600 hover:cursor-pointer"
          >
            Mark as completed
          </button>
        )}
        {workout && workout.exercisesList[workout.exercisesList.length - 1].id === activeExercise.id ? (
          <button
            type="button"
            onClick={handleCompleteWorkout}
            className="rounded-md px-2 py-1 text-sm font-semibold text-white shadow-sm bg-green-500 ring-1 ring-gray-300 hover:bg-green-600 hover:cursor-pointer"
          >
            Done
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSelectNextExercise}
            className="rounded-md px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm bg-white ring-1 ring-gray-300 hover:bg-gray-50 hover:cursor-pointer"
          >
            Next exercise
          </button>
        )}
      </div>
    </Fragment>
  );
}
