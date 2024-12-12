const BlogsPageSkeletonLoader = () => {
  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="py-6 px-6 w-full">
        <main className="flex flex-col gap-5">
          <div className="h-10 bg-gray-800 rounded-md w-1/4 animate-pulse"></div>

          <div className="flex flex-col gap-5">
            {[...Array(3)].map((_, monthIndex) => (
              <div key={monthIndex}>
                <div className="h-8 bg-gray-800 rounded-md w-1/6 mb-4 animate-pulse"></div>
                <div className="flex flex-col gap-5">
                  {[...Array(3)].map((_, blogIndex) => (
                    <div
                      key={blogIndex}
                      className="border-rounded flex flex-col bg-gray-800 border border-gray-800 rounded-lg overflow-hidden"
                    >
                      <div className="relative w-full h-56 bg-gray-800 animate-pulse"></div>
                      <div className="p-2 flex flex-col justify-between">
                        <div className="h-6 bg-gray-800 rounded-md w-3/4 mb-2 animate-pulse"></div>
                        <div className="flex justify-end items-center mt-2">
                          <div className="h-4 w-4 bg-gray-800 rounded-full mr-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-800 rounded-md w-1/4 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogsPageSkeletonLoader;
