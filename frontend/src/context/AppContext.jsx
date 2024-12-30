import { createContext, useState ,useEffect} from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'; // Ensure axios is imported

export const AppContent = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials=true  //sending cookies too
    const backendUrl = "http://localhost:4000";
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); // Default to null instead of false
    
   
    const getAuthState=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/auth/is-Auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            data.success? setUserData(data.userData):toast.error(data.message)
        } catch (error) {
            // Handle error properly
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while fetching user data.");
            }
        }
    };

  
    useEffect(() => {
      getAuthState();
    }, [])
    

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        getAuthState
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};
