import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Routes from "./routes/Routes";
import Database from "./services/database";

function App()
{
    const auth = useAuth()

    // if is authenticated, sync data
    useEffect(() => {
        if (auth.authenticated) {
            const db = new Database()
            db.sync()
        }
    }, [auth.authenticated])

    return <>
        <Routes />
        <Toaster position="top-right" />
    </>
}

export default App;