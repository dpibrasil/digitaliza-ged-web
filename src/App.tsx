import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ScanModal from "./modals/ScanModal";
import Routes from "./routes/Routes";
import Database from "./services/database";
import { syncDocumentFromQueue } from "./services/synchronization";

const queryClient = new QueryClient()

function App()
{
    const db = useMemo(() => new Database(), [])
    const [synced, setSynced] = useState(false)
    const auth = useAuth()
    const documentsQueue = useLiveQuery(() => db.documentsQueue.toArray())

    documentsQueue?.filter(d => !d.synced && !d.fail).map(syncDocumentFromQueue) 

    // if is authenticated, sync data
    useEffect(() => {
        if (auth.authenticated) {
            let online = true
            setInterval(() => {
                try {
                    if (online) db.sync()
                } catch (e) {
                    online = false
                }
            }, 60000)
            db.sync()
        }
    }, [auth.authenticated, db])

    useEffect(() => {
        if (!synced && documentsQueue) {
            documentsQueue?.filter(d => !d.synced).map(syncDocumentFromQueue) 
            setSynced(true)
        }
    }, [documentsQueue])

    return <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
        <ScanModal />
        <Toaster position="top-right" />
    </QueryClientProvider>
}

export default App;