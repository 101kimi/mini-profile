import React from 'react';
import { useUserStore } from '../store/userStore';

export function ProfileDisplay() {
  const { profile } = useUserStore();

  return (
    <div className="text-center mb-8">
      <div className="relative w-24 h-24 mx-auto">
        <img
          src={profile?.avatar}
          alt={profile?.name}
          className="w-full h-full object-cover rounded-[40%] ring-2 ring-blue-100"
        />
      </div>
      <h2 className="text-xl font-semibold mt-4">{profile?.name}</h2>
      <p className="text-gray-600 mt-2">{profile?.bio}</p>
    </div>
  );
}