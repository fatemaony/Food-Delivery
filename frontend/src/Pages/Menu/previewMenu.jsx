import React from 'react'

const previewMenu = () => {
  return (
    <div className="card bg-base-100 shadow-lg mt-8">
          <div className="card-body">
            <h3 className="card-title text-base-content mb-4">Menu Item Preview</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-base-300 flex items-center justify-center flex-shrink-0">
                <span className="text-base-content/50">Image</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-base-content">
                  Food Name
                </h4>
                <p className="text-base-content/70 mt-1">
                  Food description will appear here...
                </p>
                <div className="text-2xl font-bold text-primary mt-2">
                  $0.00
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default previewMenu
