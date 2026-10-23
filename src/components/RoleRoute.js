import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";



const RoleRoute = ({role}) => {

    const {user, loading} = useContext(AuthContext);

    if(loading)
        return <div className="p-6 text-center">Loading ... </div>;

    if(!user)
        return <Navigate to="/login" replace />;

    if (user.role !== role) {
        return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
    }

    return <Outlet />;

};

export default RoleRoute;