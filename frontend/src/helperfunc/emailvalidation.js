import axios from "axios";
import toast from "react-hot-toast";

const verifyEmail = async (email) => {
  const apiKey = process.env.REACT_APP_EMAIL_VALIDATION_KEY;  // Replace with your ZeroBounce API key

  // console.log(apiKey)
  // return;
  try {
    const response = await axios.get(`https://api.zerobounce.net/v2/validate`, {
      params: {
        api_key: apiKey,
        email: email,
      },
    });
    
    if (response.data.status === 'valid') {
      return true
    } else if (response.data.status === 'invalid') {
      toast.error('The email does not exist.');
      return false
    }
  } catch (error) {
    // console.error('Error validating email:', error);
    toast.error("Some unwanted happen")
    return false;
  }
};

// verifyEmail('arnabpramanik@gmail.com'); // Replace with user email input

export default verifyEmail
// 