import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Routes from "./routes/Routes";
import Database from "./services/database";
import { syncDocumentFromQueue } from "./services/synchronization";

function App()
{
    const db = new Database()
    const auth = useAuth()
    const documentsQueue = useLiveQuery(() => db.documentsQueue.toArray())

    documentsQueue?.filter(d => !d.synced).map(syncDocumentFromQueue) 

    // if is authenticated, sync data
    useEffect(() => {
        if (auth.authenticated) {
            db.sync()
        }
    }, [auth.authenticated])

    return <>
        <Routes />
        <Toaster position="top-right" />
    </>
}

export default App;