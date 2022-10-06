import React from "react";
import {BrowserRouter, Navigate, Route, Routes as RouterRoutes} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import Search from "../pages/Search";
import SignIn from "../pages/SignIn";
import SignOut from "../pages/SignOut";

function Routes()
{
    const auth = useAuth()

    return <BrowserRouter>
        <RouterRoutes>
            <Route path="/auth">
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-out" element={<SignOut />} />
            </Route>
            {auth.authenticated ? <>
                <Route index element={<Search />} />
            </> : <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />}
        </RouterRoutes>
    </BrowserRouter>
}

export default Routes;