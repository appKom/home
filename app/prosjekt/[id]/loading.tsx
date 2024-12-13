import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full flex justify-center min-h-screen animate-pulse">
      <div className="w-full">
        <main className="flex flex-col">
          <div className="w-full flex justify-center">
            <div className="w-full h-96 bg-gray-800" />
          </div>

          <div className="px-6">
            <div className="pt-8">
              <div className="h-10 bg-gray-800 w-3/4 rounded" />
            </div>

            <div className="w-full flex justify-center py-6">
              <div className="w-full">
                <div>
                  <div className="h-8 bg-gray-800 w-40 rounded mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="h-8 w-24 bg-gray-800 rounded-md"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-6">
                  <div className="flex flex-row gap-2">
                    <div className="h-6 w-6 bg-gray-800 rounded-full" />
                    <div className="h-6 bg-gray-800 w-32 rounded" />
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="h-6 w-6 bg-gray-800 rounded-full" />
                    <div className="h-6 bg-gray-800 w-32 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <article className="w-full pb-8">
              <div className="h-4 bg-gray-800 w-full rounded mb-2" />
              <div className="h-4 bg-gray-800 w-full rounded mb-2" />
              <div className="h-4 bg-gray-800 w-3/4 rounded" />
            </article>

            <div className="h-8 bg-gray-800 w-40 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 w-full gap-4 pt-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-40 bg-gray-800 rounded" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkeletonLoader;
