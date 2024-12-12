const BlogLoadingPage = () => {
  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="w-full">
        <main className="flex flex-col">
          <div className="w-full flex justify-center">
            <div className="w-full h-96 bg-gray-800 animate-pulse" />
          </div>
          <div className="flex flex-col px-6">
            <div className="flex flex-col sm:flex-row justify-between pt-8">
              <div className="h-8 bg-gray-800 w-3/4 mb-4 animate-pulse" />
              <div className="flex flex-row items-center gap-2 mt-4 sm:mt-0">
                <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
                <div className="h-6 bg-gray-800 w-24 animate-pulse" />
                <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-row gap-2 pt-4">
              <div className="w-8 h-8 bg-gray-800 animate-pulse" />
              <div className="h-6 bg-gray-800 w-48 animate-pulse" />
            </div>
          </div>
          <article className="w-full px-6 py-12">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-800 w-full animate-pulse" />
              ))}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogLoadingPage;
