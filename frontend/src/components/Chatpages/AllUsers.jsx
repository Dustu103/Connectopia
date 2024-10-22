import React from 'react'
import { Link } from 'react-router-dom'

function AllUsers({data,onclose}) {
  return (
    <Link to={data._id} onClick={onclose} className='flex items-center gap-3 border border-transparent border-t-slate-200 hover:border hover:border-cyan-800 rounded'>
      <div className='m-1'>
        <img src={data.profile_pic} className='h-[50px] w-[50px] rounded-full'/>
      </div>
      <div>
        <div className="font-semibold">
          {data.name}
        </div>
        <p className='text-sm opacity-80 text-ellipsis line-clamp-1'>{data.email}</p>
      </div>
    </Link>
  )
}

export default AllUsers
