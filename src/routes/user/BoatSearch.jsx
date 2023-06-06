import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState, useRef } from "react";
import facade from "../../ApiFacade";
import { Dialog, Transition } from "@headlessui/react";
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
export default function UserBoats({ username }) {
  const [boats, setBoats] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  //handle delete
  function handleDelete(id) {
    facade.deleteBoat(id);
  }

  //handle open
  function handleOpen() {
    setOpen(true);
  }

  function handleChange(e) {
    setInput(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    facade.fetchAllBoats(input).then((data) => {
      // if workouts consists of workouts with the same name, filter them out
      const filteredBoats = data.filter((boat, index, self) => self.findIndex((w) => w.brand === boat.brand) === index);
      setBoats(filteredBoats);
    });
  }

  useEffect(() => {
    facade.fetchAllBoats().then((data) => {
      console.log(data);
      setBoats(data);
    });
  }, []);

  return (
    <Fragment>
      <form>
        <div className="flex gap-2">
          <input onChange={handleChange} className="px-3 py-2 border rounded w-full" placeholder="Search by muscle group" />
        </div>
      </form>
      {boats.length === 0 && (
        <div className="mt-10">
          <p className="text-center text-gray-500">No workouts found</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mt-10">
        {boats
          .filter((boat) => (input.toLowerCase() === "" ? boat : boat.brand.toLowerCase().includes(input)))
          .map((boat) => (
            <div key={boat.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{boat.brand}</h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:px-6">
                    <button className="btn bg-indigo-600 text-white px-3 py-2 rounded" onClick={handleOpen}>
                      More info
                    </button>
                  </div>
                </dl>
              </div>
            </div>
          ))}
      </div>

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
                  .filter((boat) => (input.toLowerCase() === "" ? boat : boat.brand.toLowerCase().includes(input)))
                  .map((boat) => (
                    <tr key={boat.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{boat.brand}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{boat.make}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <img src={boat.image} alt="" />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{boat.harbour}</td>
                      {boat.owner &&
                        boat.owner.map((data) => (
                          <td key={data.id} className="whitespace-nowrap px-1 py-1 text-sm text-gray-500 flex">
                            {data.name}
                          </td>
                        ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {boat.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
