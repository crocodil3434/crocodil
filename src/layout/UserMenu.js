import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebaseConfig'; // Doğru yolu kullanın
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const UserMenu = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(firestore, "doctors", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No user data found in Firestore");
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <aside className="fixed top-0 right-0 z-40 w-64 h-screen pt-20 lg:pt-0 transition-transform translate-x-full bg-white border-l border-gray-200 lg:!translate-x-0" aria-label="Profilebar" id="user-drawer">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white">
        <div className="flex flex-col items-center">
          <img className="w-20 h-20 rounded-full" src={userData?.photoUrl || 'https://bulutklinik.com/assets/bulut-klinik/images/logos/doctor-man.png'} alt="User photo" />
          <div className="mt-2 text-center">
            <h3 className="font-bold text-xl">{userData?.firstName || 'User'} {userData?.lastName}</h3>
            <p>{user?.email}</p>
          </div>

          <button onClick={handleLogout} type="button" className="my-5 w-full flex items-center justify-center py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
            Logout
          </button>
        </div>
        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200">
          {/* Additional menu items if needed */}
          <li>
            <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group">
              About
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group">
              Projects
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group">
              Work experience
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default UserMenu;
