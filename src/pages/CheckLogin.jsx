
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedinUser } from "../auth/authSlice";
function CheckLogin({children}){
    const user=useSelector(selectLoggedinUser);
   if(!user)
   {
    return <Navigate to="/login"/>
   }
   return children;
}
export default CheckLogin;