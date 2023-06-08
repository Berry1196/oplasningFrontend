import React from "react";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import facade from "../../ApiFacade";

export default function AdminHarbour() {
  const [harbours, setHarbours] = useState([]);
  const [boats, setBoats] = useState([]);
  const [owners, setOwners] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    facade.fetchHarbour().then((data) => setHarbours(data));
    facade.fetchAllBoats().then((data) => setBoats(data));
    facade.getOwners().then((data) => setOwners(data));
  }, []);

  function handleSearch(e) {
    setSearchInput(e.target.value);
  }

  function handleDelete(id) {
    facade.deleteHarbour(id);
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
                {harbours
                  .filter((harbour) => (searchInput.toLowerCase() === "" ? harbour.name.toLowerCase() : harbour.name.toLowerCase().includes(searchInput.toLowerCase())))
                  .map((harbour) => (
                    <tr key={harbour.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{harbour.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{harbour.address}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{harbour.capacity}</td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => {}}
                          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            handleDelete(harbour.id);
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
    </Fragment>
  );
}
