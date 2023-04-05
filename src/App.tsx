import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { DocumentContextProvider } from "./context/DocumentContext";
import ScanModal from "./modals/ScanModal";
import Routes from "./routes/Routes";
import Database from "./services/database";
import { syncDocumentFromQueue } from "./services/synchronization";

const queryClient = new QueryClient()

function App()
{
    const db = useMemo(() => new Database(), [])
    const [synced, setSynced] = useState(false)
    const documentsQueue = useLiveQuery(() => db.documentsQueue.toArray())

    documentsQueue?.filter(d => !d.synced && !d.fail).map(syncDocumentFromQueue) 

    useEffect(() => {
        if (!synced && documentsQueue) {
            documentsQueue?.filter(d => !d.synced).map(syncDocumentFromQueue) 
            setSynced(true)
        }
    }, [documentsQueue, synced])

    return <QueryClientProvider client={queryClient}>
        <DocumentContextProvider>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
            <ScanModal />
        </DocumentContextProvider>
        <Toaster position="top-right" />
    </QueryClientProvider>
}

export default App;