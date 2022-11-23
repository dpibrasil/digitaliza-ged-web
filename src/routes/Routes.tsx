import { useEffect } from 'react';
import { Navigate, Route, Routes as RouterRoutes, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import DocumentEdit from '../pages/DocumentEdit';
import DocumentView from "../pages/DocumentView";
import Organization from "../pages/Organization";
import Organizations from "../pages/Organizations";
import Search from "../pages/Search";
import SignIn from "../pages/SignIn";
import SignOut from "../pages/SignOut";
import Users from "../pages/Users";
import ReactGA from 'react-ga4';

function Routes()
{
    const auth = useAuth()
    
    const location = useLocation()
    
    useEffect(() => {
        ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }, [location.pathname])

    return <RouterRoutes>
            <Route path="/auth">
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-out" element={<SignOut />} />
            </Route>
            {auth.authenticated ? <>
                <Route index element={<Search />} />
                <Route path="documents/:documentId" element={<DocumentView />} />
                <Route path="documents/create" element={<DocumentEdit />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="organizations/:organizationId" element={<Organization />} />
                <Route path="Users" element={<Users />} />
            </> : <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />}
        </RouterRoutes>
}

export default Routes;