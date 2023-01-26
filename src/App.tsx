import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ServiceProvider } from "./context/ServiceContext";
import ScanModal from "./modals/ScanModal";
import Routes from "./routes/Routes";
import Database from "./services/database";
import { syncDocumentFromQueue } from "./services/synchronization";

const queryClient = new QueryClient()

function App()
{
    const db = useMemo(() => new Database(), [])
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

    return <QueryClientProvider client={queryClient}>
        <ServiceProvider>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
            <ScanModal />
        </ServiceProvider>
        <Toaster position="top-right" />
    </QueryClientProvider>
}

export default App;