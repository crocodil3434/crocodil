import React, { useState, useEffect, Fragment } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverT } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import {
  Bars3CenterLeftIcon,
  CogIcon,
  HomeIcon,
  XMarkIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';

const navigation = [{ name: 'Home', href: '/dashboard', icon: HomeIcon, current: true }];
const secondaryNavigation = [
  { name: 'Dosyalar', href: '/soon', icon: DocumentIcon },
  { name: 'Araçlar', href: '/soon', icon: CogIcon },
];
const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
};
const placeholderImg = '/placeholder.jpeg';
const Logo = 'Logo-v.png'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}



export default function Form1() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10; // Total number of steps in the form
  const [formData, setFormData] = useState({
    step1: {
      fullName: '',
      age: '',
      assessmentDate: '',
      gender: '',
      educationLevel: '',
      profession: '',
      diagnosis: ''
    },
    // Additional steps initialized similarly
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [`step${currentStep}`]: e.target.value });
  };


    const location = useLocation();
    const { doctorId, patientId } = location.state || { doctorId: '', patientId: '' };

    // State for form inputs
    const [inputOne, setInputOne] = useState('');
    const [inputTwo, setInputTwo] = useState('');
    const [user, loading] = useAuthState(auth);


    const inputConfigs = {
      1: [
        { label: 'Ad Soyad', type: 'text', name: 'fullName' },
        { label: 'Yaş', type: 'number', name: 'age' },
        { label: 'Değerlendirme Tarihi', type: 'date', name: 'assessmentDate' },
        { label: 'Cinsiyet', type: 'text', name: 'gender' },
        { label: 'Eğitim Düzeyi', type: 'text', name: 'educationLevel' },
        { label: 'Meslek', type: 'text', name: 'profession' },
        { label: 'Tanı', type: 'text', name: 'diagnosis' }
      ],
      // Additional steps configured similarly
    };

    const handleInputChange = (step, inputName, value) => {
      setFormData({
        ...formData,
        [step]: {
          ...formData[step],
          [inputName]: value
        }
      });
    };
  
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      try {
        await addDoc(collection(firestore, 'forms'), {
          formData,
          formType: 'Form 1',
          doctorId,
          patientId
        });
        alert('Form 1 successfully submitted');
        setCurrentStep(1); // Reset to first step or navigate away
        setFormData({}); // Reset form data
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form');
      }
      setIsSubmitting(false);
    };
  


  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  
  const pageCount = Math.ceil(patients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = patients.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(firestore, "doctors", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Fetched user data:", docSnap.data()); // Burada verileri konsola yazdırıyoruz.
        setUserData(docSnap.data());
      } else {
        console.log("No user data found in Firestore");
      }
    };
  
    fetchUserData();
  }, [user]);






  return (
      <div className="min-h-screen bg-gray-100">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-cyan-700 pb-4 pt-5">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src={Logo}
                      alt="Crocodil logo"
                    />
                  </div>
                  <nav
                    className="mt-5 h-full flex-shrink-0 divide-y divide-cyan-800 overflow-y-auto"
                    aria-label="Sidebar"
                  >
                    <div className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-cyan-800 text-white'
                              : 'text-cyan-100 hover:bg-cyan-600 hover:text-white',
                            'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200" aria-hidden="true" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="mt-6 pt-6">
                      <div className="space-y-1 px-2">
                        {secondaryNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-cyan-100 hover:bg-cyan-600 hover:text-white"
                          >
                            <item.icon className="mr-4 h-6 w-6 text-cyan-200" aria-hidden="true" />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-teal-700 pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                className="h-8 w-auto"
                src={Logo}
                alt="Crocodil logo"
              />
            </div>
            <nav className="mt-5 flex flex-1 flex-col divide-y divide-cyan-800 overflow-y-auto" aria-label="Sidebar">
              <div className="space-y-1 px-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-cyan-800 text-white' : 'text-cyan-100 hover:bg-cyan-600 hover:text-white',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-6">
                <div className="space-y-1 px-2">
                  {secondaryNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white"
                    >
                      <item.icon className="mr-4 h-6 w-6 text-cyan-200" aria-hidden="true" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Search bar */}
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="flex flex-1">
                     </div>
              <div className="ml-4 flex items-center md:ml-6">
          

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <span className="absolute -inset-1.5 lg:hidden" />
                      <img
                        className="h-8 w-8 rounded-full"
                        src={userData?.photoUrl || placeholderImg}    
                        alt="Profile Photo"
                      />
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>{userData?.firstName || 'User'} {userData?.lastName}
                      </span>
                      <ChevronDownIcon
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/logout"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Logout
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            {/* Page header */}
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
                           Merhaba, {userData?.firstName || 'User'} {userData?.lastName}
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
    className={`mr-1.5 h-5 w-5 flex-shrink-0 ${userData?.paymentStatus ? 'text-green-400' : 'text-red-400'}`}
    aria-hidden="true"
  />
  {userData?.paymentStatus ? 'Payment Successful' : 'Payment Failed'}
</dd>

                        </dl>
                      </div>
                    </div>
                  </div>
          
                </div>
              </div>
            </div>

            <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {Object.entries(formData).map(([name, value]) => (
              <div key={name} className="w-full">
                <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} {/* Convert camelCase to spaced words */}
                </label>
                <input
                  type={name === 'age' || name === 'assessmentDate' ? (name === 'age' ? 'number' : 'date') : 'text'}
                  id={name}
                  name={name}
                  value={value}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Add product
          </button>
        </form>
      </div>
    </section>





    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 items-center">
    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div>
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
              </div>
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                {inputConfigs[currentStep].map(({ label, type, name }) => (
                  <div key={name} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      {label}
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <input
                        type={type}
                        name={name}
                        id={name}
                        value={formData[`step${currentStep}`][name]}
                        onChange={(e) => handleInputChange(`step${currentStep}`, name, e.target.value)}
                        autoComplete={name}
                        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="ml-3 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleNext}
                disabled={currentStep === Object.keys(inputConfigs).length}
              >
                Next
              </button>
              <button
                type="submit"
                className="ml-3 bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
          </div>
        </form>

 

  


          </main>
        </div>
      </div>

  )
}
