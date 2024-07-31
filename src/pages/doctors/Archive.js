import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/doctor/sidebar/Index";
import { useAuth } from "../../context/AuthContext";
import { BuildingOfficeIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { getArchievedPatients } from "../../functions/index";
const placeholderImg = "/placeholder.jpeg";

export default function Archive() {
  const { userData, currentUser } = useAuth();
  const [currentItems, setCurrentItems] = useState([]);

  const getPatients = async () => {
    const response = await getArchievedPatients(currentUser.uid);

    setCurrentItems(response);
    console.log("response", response);
  };

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <Layout>
      <div className="w-full">
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
            <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
              <div className="min-w-0 flex-1">
                {/* Profile */}
                <div className="flex items-center">
                  <img
                    className="hidden h-16 w-16 rounded-full sm:block"
                    src={userData?.photoUrl || placeholderImg}
                    alt="Profile Photo"
                  />
                  <div>
                    <div className="flex items-center">
                      <img
                        className="h-16 w-16 rounded-full sm:hidden"
                        src={userData?.photoUrl || placeholderImg}
                        alt="Profile Photo"
                      />
                      <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                        Merhaba, {userData?.firstName || "User"}{" "}
                        {userData?.lastName}
                      </h1>
                    </div>
                    <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dt className="sr-only">Company</dt>
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <BuildingOfficeIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {userData?.workplace}
                      </dd>
                      <dt className="sr-only">Account status</dt>
                      <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                        <CheckCircleIcon
                          className={`mr-1.5 h-5 w-5 flex-shrink-0 ${
                            userData?.paymentStatus
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                          aria-hidden="true"
                        />
                        {userData?.paymentStatus
                          ? "Payment Successful"
                          : "Payment Failed"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity table (small breakpoint and up) */}
        <div className="hidden sm:block">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mt-2 flex flex-col">
              <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-400 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Danışan Adı
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-400 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Telefon
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-400 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Bakım veren Adı/Soyadı
                      </th>

                      {/* Diğer sütun başlıklarınızı buraya ekleyebilirsiniz */}
                    </tr>
                  </thead>
                  {/* Öğelerin dinamik olarak render edilmesi */}
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Link to={`/archivedPatient/${item.id}`}>
                            {item?.patient?.firstName} {item?.patient?.lastName}
                          </Link>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {item?.patient?.phone}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {item?.patient?.caregiverName}
                        </td>
                        {/* Diğer veriler */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination kontrolü ve gösterim metni */}
                {/* <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {indexOfLastItem > patients.length
                          ? patients.length
                          : indexOfLastItem}
                      </span>{" "}
                      of <span className="font-medium">{patients.length}</span>{" "}
                      results
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 ${
                            currentPage === number ? "bg-teal-500" : "bg-white"
                          } border border-gray-300 rounded-md`}
                        >
                          {number}
                        </button>
                      )
                    )}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
