import React, { useEffect } from 'react'
import axios from 'axios'

function Check() {
    // const [data, setData] = useState(null);
    const fetchData = async () => {
        try {
            const { data } = await axios.get("https://connectopia-ebka.onrender.com");
            console.log(data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    },[])
  return (
    <div>
      check
    </div>
  )
}

export default Check
