const WEB_URL = "https://staudal.org/workout/api/";

function apiFacade() {
  const setToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  async function login(username, password) {
    const options = makeOptions("POST", true, {
      username: username,
      password: password,
    });
    const data = await fetch(WEB_URL + "login", options);
    const res = await data.json();
    return res;
  }

  //Create user fucntion
  async function createUser(user) {
    const options = makeOptions("POST", true, user);
    const data = await fetch(WEB_URL + "signup", options);
    const res = await data.json();
    return res;
  }

  // Creates an exercise
  async function createExercise(exercise) {
    const options = makeOptions("POST", true, exercise);
    const data = await fetch(WEB_URL + "exercises", options);
    const res = await data.json();
    return res;
  }

  // Deletes an exercise
  async function deleteExercise(id) {
    const options = makeOptions("DELETE", true);
    const data = await fetch(WEB_URL + "exercises/" + id, options);
    const res = await data.json();
    return res;
  }

  // Deletes a workout
  async function deleteWorkout(id) {
    const options = makeOptions("DELETE", true);
    const data = await fetch(WEB_URL + "workouts/" + id, options);
    const res = await data.json();
    return res;
  }

  // Retrieves all exercises
  async function getExercises() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "exercises", options);
    const res = await data.json();
    return res;
  }

  // add workout to user
  async function linkWorkoutToUser(username, workout) {
    const options = makeOptions("POST", true, workout);
    const data = await fetch(WEB_URL + "workouts/" + username, options);
    const res = await data.json();
    return res;
  }

  //add exercise to workout by id
  async function linkExerciseToWorkout(id, exercise) {
    const options = makeOptions("POST", true, exercise);
    const data = await fetch(WEB_URL + "workouts/exercises/" + id, options);
    const res = await data.json();
    return res;
  }

  async function createWorkout(workout) {
    const options = makeOptions("POST", true, workout);
    const data = await fetch(WEB_URL + "workouts", options);
    const res = await data.json();
    return res;
  }

  // create muscle photo
  async function generatePhoto(muscles) {
    // Rename muscle groups
    if (muscles.includes("hamstrings")) {
      muscles = muscles.replace("hamstrings", "hamstring");
    }

    const data = await fetch(WEB_URL + "workouts/photo", {
      method: "POST",
      body: muscles,
    });
    const blob = await data.blob();
    const imageFile = new Blob([blob]);
    const imageUrl = URL.createObjectURL(imageFile);
    return imageUrl;
  }

  // fetch data and catch possible errors
  async function fetchAdminData() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "info/admin", options);
    return data.json();
  }

  async function fetchUserData() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "info/user", options);
    return data.json();
  }
  async function fetchData(url) {
    const options = makeOptions("GET", true);
    const data = await fetch(url, options);
    return data.json();
  }

  async function fetchWorkout(muscle) {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "workouts/" + muscle, options);
    return data.json();
  }

  async function fetchWorkouts() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "workouts", options);
    return data.json();
  }

  async function fetchWorkoutsByUsername(username) {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "workouts/user/" + username, options);
    return data.json();
  }

  async function deleteWorkoutFromUser(username, id) {
    const options = makeOptions("DELETE", true);
    const data = await fetch(WEB_URL + "workouts/user/" + username + "/" + id, options);
    return data.json();
  }

  async function fetchExerciseByName(name) {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "exercises/" + name, options);
    return data.json();
  }

  async function createExerciseStatus(exerciseStatus) {
    const options = makeOptions("POST", true, exerciseStatus);
    const data = await fetch(WEB_URL + "exercisestatus", options);
    return data.json();
  }

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };

  function readJwtToken(token) {
    // console.log('TOKEN opened with atob: ',window.atob(token));
    var base64Url = token.split(".")[1];
    // console.log(base64Url);
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // console.log(base64);
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchAdminData,
    fetchUserData,
    readJwtToken,
    fetchData,
    fetchWorkout,
    createUser,
    generatePhoto,
    fetchWorkouts,
    linkWorkoutToUser,
    createExercise,
    deleteExercise,
    getExercises,
    createWorkout,
    fetchWorkoutsByUsername,
    linkExerciseToWorkout,
    fetchExerciseByName,
    deleteWorkout,
    deleteWorkoutFromUser,
    createExerciseStatus,
  };
}
const facade = apiFacade();
export default facade;
