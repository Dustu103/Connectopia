import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import Spinner from './Spinner';
import axios from 'axios';
import AllUsers from './AllUsers';

function SearchUser({onClose}) {
    const [searchUser,setSearchUser]=useState([])
    const [loading, setLoading]= useState(true)
    const [search,setSearch]=useState('')

    const usersearch = (e)=>{
      setSearch(e.target.value);
    }
    console.log(search)


    const alluser=async()=>{
      try {
        const respon = JSON.parse(localStorage.getItem('userInfo'));
        const {data}=await axios.get(`${process.env.REACT_APP_BACKEND}/user/`,{headers: {authorization: `${respon.token}`}});
        console.log(data.data)
        if(data.data){
          setSearchUser(data.data)
          setLoading(false)
        }else{
          setSearchUser([])
          setTimeout(() => {
          setLoading(false)
          }, 500);
        }
        
      } catch (error) {
        console.log(error)
      }      
    }

    useEffect(()=>{
      const fetchData = async () => {
        await alluser();
    };

    fetchData();
    },[])

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-35 p-2 z-[1000000000]' onClick={onClose}>
      <div className='w-full max-w-lg mx-auto mt-12 m-1' onClick={(e) => e.stopPropagation()}>
       <div className='bg-red-500 h-14 rounded overflow-hidden flex'>
        {/* <form> */}
        <input type="text" placeholder='Search User by name,email...' className='w-full outline-none py-1 h-full px-4' onChange={usersearch}/>
        <div className=' h-14 flex justify-center items-center w-14'>
            <FaSearch size={23}/>
        </div>
        {/* </form> */}
       </div>
       {/* display search user */}
       <div className='bg-white mt-2 w-full p-4 rounded'>
        {/* No user */}
        {
            searchUser.length === 0 && !loading && (
                <p className='text-center text-slate-500'>No User Found!!!!</p>
            )
        }
        {
            loading && (
                <Spinner/>
            )
        }
        { searchUser.length !==0 && !loading && (
    (() => {
      // Filter the users based on the search input
      const filteredUsers = searchUser.filter((item) => {
        return search.toLowerCase() === ''
          ? item
          : item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase());
      });

      // Check if there are any filtered users
      if (filteredUsers.length === 0) {
        return <p className='text-center text-slate-500'>No one with this Email or Username exist</p>; // Display "No one there" if no users match
      }

      // Map over the filtered users and render the AllUsers component
      return filteredUsers.map((item, index) => {
        // console.log(item); // Optional: log the item
        return <AllUsers key={index} data={item} onclose={onClose}/>;
      });
    })()
  )
}


       </div>
      </div>
    </div>
  )
}

export default SearchUser
