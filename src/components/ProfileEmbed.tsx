import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileEmbedProps {
  userId: string;
  accent?: string;
  className?: string;
}

export function ProfileEmbed({ userId, accent = "bg-blue-400", className = "" }: ProfileEmbedProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      <div className={`h-1 ${accent}`} />
      <iframe
        src={`/${userId}`}
        title={`${userId}'s profile`}
        className="w-full h-[400px] border-none"
      />
      <div className="p-4 border-t">
        <Link
          to={`/${userId}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-between"
        >
          <span>View full profile</span>
          <span>@{userId}</span>
        </Link>
      </div>
    </div>
  );
}