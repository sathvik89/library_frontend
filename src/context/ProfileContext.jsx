import React, { createContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext';
import Profile from '../Components/Profile';
import ProfileEdit from '../Components/ProfileEdit';
export const profileDetails = createContext();


const ProfileContext = ({children}) => {
    const { user } = useAuth();
    const [name, Setname] = useState("Sathvik Koriginja")
    const [phone, setPhone] = useState("+91 9347868783");
    const [email, setEmail] = useState("k*****@gmail.com");
    const [address, setAddress] = useState("Hyderabad");
    const [password, setPassword] = useState("password_Dummy_123"); 

    useEffect(() => {
        if (user) {
            Setname(user.displayName || user.email || "User");
            setEmail(user.email || "k*****@gmail.com");
        }
    }, [user]);

    function handlePhoneChange(e){
        setPhone(e.target.value)
    }
    function handleEmailChange(e){
        setEmail(e.target.value)
    }
    function handleAddresschange(e){
        setAddress(e.target.value)
    }
    function handleNameChange(e){
        Setname(e.target.value)
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }
    const contextValues ={
        name,phone,email,address,password,handlePhoneChange,handleEmailChange,handleAddresschange,handleNameChange,handlePasswordChange
    }
  return (
    <profileDetails.Provider value={contextValues}>
{children}
    </profileDetails.Provider>
  )
}

export default ProfileContext