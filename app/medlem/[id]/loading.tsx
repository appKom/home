import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-12 animate-pulse">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
        <div className="relative flex-shrink-0">
          <div className="w-48 h-48 rounded-full bg-gray-800" />
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="h-8 bg-gray-800 rounded w-48 mb-2" />
          <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-24 bg-gray-800 rounded-full" />
            ))}
          </div>
          <div className="h-4 bg-gray-800 rounded w-36 my-2" />
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-6 h-6 bg-gray-800 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="max-w-screen-md mx-auto text-center">
          <div className="w-10 h-10 mx-auto mb-3 bg-gray-800 rounded-full" />
          <div className="h-24 bg-gray-800 rounded mb-4" />
          <div className="h-4 bg-gray-800 rounded w-48 mx-auto" />
        </div>
      </div>

      <div className="w-full h-40 bg-gray-800 rounded-lg mt-8" />

      <div className="mt-16">
        <div className="h-8 bg-gray-800 rounded w-36 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SkeletonLoader;
