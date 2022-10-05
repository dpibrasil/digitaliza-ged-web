import React from "react";
import {BrowserRouter, Route, Routes as RouterRoutes} from 'react-router-dom'
import Layout from "../components/Layout";
import Search from "../pages/Search";
import SignIn from "../pages/SignIn";
import SignOut from "../pages/SignOut";

function Routes()
{
    return <BrowserRouter>
        <RouterRoutes>
            <Route path="/auth">
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-out" element={<SignOut />} />
            </Route>
            <Route index element={<Search />} />
        </RouterRoutes>
    </BrowserRouter>
}

export default Routes;