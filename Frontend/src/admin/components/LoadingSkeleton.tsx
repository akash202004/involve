export default function LoadingSkeleton() {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 p-6 rounded-lg h-28"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-200 p-6 rounded-lg h-80"></div>
          <div className="bg-gray-200 p-6 rounded-lg h-80"></div>
        </div>
        
        <div className="bg-gray-200 p-6 rounded-lg h-96"></div>
        
        <div className="bg-gray-200 p-6 rounded-lg h-96"></div>
      </div>
    )
  }