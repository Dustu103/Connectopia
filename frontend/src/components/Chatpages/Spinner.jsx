import React from 'react'

function Spinner() {
  return (
    <div className='w-full flex justify-center'>
        <div className="w-12 h-12 rounded-full animate-spin
                    border-2 border-dashed border-blue-500 border-t-transparent"></div>
    </div>
  )
}

export default Spinner
