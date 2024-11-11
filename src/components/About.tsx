import React from 'react';
import { Link } from 'react-router-dom';
import { ProfileCarousel } from './ProfileCarousel';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-4xl font-['Cookie'] text-black hover:text-pink-600 transition-colors">
            mini
          </Link>
          <div className="space-x-4">
            <Link
              to="/"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-5xl bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-transparent bg-clip-text">Create Your</span>{' '}
              <span className="mx-4 font-['Cookie'] text-7xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-transparent bg-clip-text animate-gradient">mini</span>{' '}
              <span className="text-5xl bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-transparent bg-clip-text">Profile</span>
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Profile that only collects pins.📌
            </p>
          </div>

          <div className="mb-24 px-4">
            <ProfileCarousel userIds={['duck', 'kamo', 'ahiru']} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <div className="group relative bg-gradient-to-br from-pink-100 via-rose-50 to-red-50 rounded-2xl p-8 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 transform group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M12 21C12 21 3 14 3 8C3 4.5 5.5 2 9 2C10.6 2 12 3 12 3C12 3 13.4 2 15 2C18.5 2 21 4.5 21 8C21 14 12 21 12 21Z" className="fill-gradient-warm stroke-rose-500" strokeWidth="1.5"/>
                    <path d="M12 21C12 21 3 14 3 8C3 4.5 5.5 2 9 2C10.6 2 12 3 12 3" className="stroke-red-400" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 3C12 3 13.4 2 15 2C18.5 2 21 4.5 21 8C21 14 12 21 12 21" className="stroke-pink-500" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="8" r="2" className="fill-white"/>
                    <defs>
                      <linearGradient id="gradient-warm" x1="3" y1="2" x2="21" y2="21">
                        <stop offset="0%" stopColor="#EC4899"/>
                        <stop offset="50%" stopColor="#F43F5E"/>
                        <stop offset="100%" stopColor="#E11D48"/>
                      </linearGradient>
                    </defs>
                    <style>{`.fill-gradient-warm { fill: url(#gradient-warm); }`}</style>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-rose-600">Add Your Pins</h3>
                <p className="text-black leading-relaxed">
                  Curate your digital space with pins from your favorite websites. Each pin is a gateway to content that matters to you, arranged exactly how you want it.
                </p>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-red-500/5 rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-fuchsia-100 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 transform group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <circle cx="11" cy="11" r="7" className="fill-gradient-rose stroke-fuchsia-500" strokeWidth="1.5"/>
                    <path d="M20 20L16 16" className="stroke-purple-500" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 11H14M11 8V14" className="stroke-white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M19 5L20 6M4 19L5 20M19 19L20 18M4 5L5 4" className="stroke-pink-400" strokeWidth="1.5" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient-rose" x1="4" y1="4" x2="18" y2="18">
                        <stop offset="0%" stopColor="#D946EF"/>
                        <stop offset="50%" stopColor="#A21CAF"/>
                        <stop offset="100%" stopColor="#EC4899"/>
                      </linearGradient>
                    </defs>
                    <style>{`.fill-gradient-rose { fill: url(#gradient-rose); }`}</style>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-fuchsia-600">Discover & Share</h3>
                <p className="text-black leading-relaxed">
                  Explore what others are pinning and add their discoveries to your collection. Build connections through shared interests and inspirations.
                </p>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-pink-500/5 rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-50 rounded-2xl p-8 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 transform group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" className="stroke-rose-500" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 2C9.34784 2 6.8043 3.05357 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12" className="stroke-pink-500" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z" className="fill-gradient-sun stroke-fuchsia-500" strokeWidth="1.5"/>
                    <path d="M12 11V13M11 12H13" className="stroke-white" strokeWidth="1.5" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient-sun" x1="8" y1="8" x2="16" y2="16">
                        <stop offset="0%" stopColor="#F43F5E"/>
                        <stop offset="50%" stopColor="#EC4899"/>
                        <stop offset="100%" stopColor="#D946EF"/>
                      </linearGradient>
                    </defs>
                    <style>{`.fill-gradient-sun { fill: url(#gradient-sun); }`}</style>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-rose-600">Make It Yours</h3>
                <p className="text-black leading-relaxed">
                  Express yourself with beautiful themes and colors. Create a profile that reflects your personality and makes your collection uniquely yours.
                </p>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-fuchsia-500/5 rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}