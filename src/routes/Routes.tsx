import {BrowserRouter, Navigate, Route, Routes as RouterRoutes} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
=======
import DocumentEdit from "../pages/DocumentEdit";
import DocumentView from "../pages/DocumentView";
>>>>>>> e483933 (Document e search view)
import Organization from "../pages/Organization";
import Organizations from "../pages/Organizations";
import Search from "../pages/Search";
import SignIn from "../pages/SignIn";
import SignOut from "../pages/SignOut";
import Users from "../pages/Users";

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
                <Route path="documents/:documentId" element={<DocumentView />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="organizations/:organizationId" element={<Organization />} />
                <Route path="Users" element={<Users />} />
            </> : <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />}
        </RouterRoutes>
    </BrowserRouter>
}

export default Routes;