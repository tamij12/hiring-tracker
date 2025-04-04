"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800 bg-opacity-75 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold mb-6">Hiring Trackter</h1>
        <p className="text-xl mb-8">
          Gestiona aplicaciones, usuarios y vacantes con facilidad. Elige una
          sección para empezar.
        </p>

        <div className="flex justify-center gap-6">
          <Link href="/applications">
            <div className="p-6 bg-blue-700 hover:bg-blue-600 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
              <h2 className="text-2xl font-semibold mb-4"> ViewApplications</h2>
            </div>
          </Link>

          <Link href="/job-openings">
            <div className="p-6 bg-purple-700 hover:bg-purple-600 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
              <h2 className="text-2xl font-semibold mb-4">View Jobs</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
