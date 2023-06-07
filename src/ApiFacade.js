const WEB_URL = "http://localhost:8080/api/";

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

  //Get owners
  async function getOwners() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "owner", options);
    const res = await data.json();
    return res;
  }

  //Create owner
  async function createOwner(owner) {
    const options = makeOptions("POST", true, owner);
    const data = await fetch(WEB_URL + "owner", options);
    const res = await data.json();
    return res;
  }

 
            

  //Delete boat
  async function deleteBoat(id) {
    const options = makeOptions("DELETE", true);
    const data = await fetch(WEB_URL + "boat/" + id, options);
    const res = await data.json();
    return res;
  }

  //Fetch Boats
  async function fetchAllBoats() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "boat", options);
    return data.json();
  }

  //Create boat
  async function createBoat(boat) {
    const options = makeOptions("POST", true, boat);
    const data = await fetch(WEB_URL + "boat", options);
    const res = await data.json();
    return res;
  }

  //Fetch harbour
  async function fetchHarbour() {
    const options = makeOptions("GET", true);
    const data = await fetch(WEB_URL + "harbour", options);
    return data.json();
  }

  // Add boat to harbour
  async function addBoatToHarbour(boat_id, harbour_id) {
    const options = makeOptions("PUT", true, {id: boat_id, harbour_id });
    const data = await fetch(
      WEB_URL + "boat", options);
    const res = await data.json();
    return res;
  }

  //Edit boat
  async function editBoat(boat_id, boat) {
    const data = null;
    fetch('http://localhost:8080/api/boat/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              //  id: boat.id,
              //harbour_id: boat.harbour_id,
                brand: boat.brand,
                make: boat.make,
                image: boat.image,
                id: boat_id,
            })
        })
            .then(response => response.json())
            .then(data1 => {
                
                data = data1;
            })
            .catch(error => {
                console.error(error);
            });
        alert("Boat edited");
    
    return  data.json();
  }

   //Edit owner
   async function editOwner(owner_id, owner) {
    const data = null;
    fetch( WEB_URL +"owner/edit", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: owner_id,
                name: owner.name,
                address: owner.address,
                phone: owner.phone,
                
            })
        })
            .then(response => response.json())
            .then(data1 => {
              data = data1;
            })
            .catch(error => {
                console.error(error);
            });
        alert("Owner edited");
          
    return data.json();
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
    createUser,
    linkWorkoutToUser,
    createExercise,
    deleteExercise,
    getExercises,
    createWorkout,
    linkExerciseToWorkout,
    fetchExerciseByName,
    deleteWorkout,
    deleteWorkoutFromUser,
    getOwners,
    createOwner,
    deleteBoat,
    fetchAllBoats,
    fetchHarbour,
    createBoat,
    addBoatToHarbour,
    editBoat,
    editOwner,
  };
}
const facade = apiFacade();
export default facade;
