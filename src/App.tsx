import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Routes from "./routes/Routes";
import Database from "./services/database";
import { syncDocumentFromQueue } from "./services/synchronization";

const queryClient = new QueryClient()

function App()
{
    const db = useMemo(() => new Database(), [])
    const auth = useAuth()
    const documentsQueue = useLiveQuery(() => db.documentsQueue.toArray())

    documentsQueue?.filter(d => !d.synced).map(syncDocumentFromQueue) 

    // if is authenticated, sync data
    useEffect(() => {
        if (auth.authenticated) {
            db.sync()
        }
    }, [auth.authenticated, db])

    return <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
        <Toaster position="top-right" />
    </QueryClientProvider>
}

export default App;