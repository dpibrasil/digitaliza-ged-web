import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import Database from "../services/database";
import { DirectoryType, OrganizationType } from "../types/OrganizationTypes";

function SyncQueue()
{
    const db = new Database()
    const ago = new Date().getTime() - (12 * 3600000)
    const documents = useLiveQuery(() => db.documentsQueue.filter(d => !d.synced || (!!d.lastSync && d.lastSync.getTime() >= ago)).toArray())
    const [directories, setDirectories] = useState<DirectoryType[]>([])
    const [organizations, setOrganizations] = useState<OrganizationType[]>([])

    useEffect(() => {
        db.organizations.toArray().then((v) => setOrganizations(v))
        db.directories.toArray().then((v) => setDirectories(v))
    }, [])

    return <div className="rounded-b-lg rounded-tl-lg p-5 bg-menu fixed right-24 top-14 w-72 text-white drop-shadow-lg">
        <h1 className="text-sm font-semibold">Fila de sincronização</h1>
        <div className="grid grid-flow-row gap-y-3 mt-4 max-h-48 overflow-y-auto">
            {documents?.map(document => {
                const directory = directories.find(d => d.id == document.directoryId)
                const organization = organizations.find(o => o.id == directory?.organizationId)
                const status = document.synced ? 'synced' : document.fail ? 'error' : 'pending' 
                return <div key={document.id} className="flex flex-row justify-start items-center">
                <div>
                    <div title={document.fail} className={`${{error: 'bg-red-500', synced: 'bg-emerald-500', pending: 'bg-yellow-500'}[status]} bg-opacity-10 w-8 h-8 rounded-lg flex items-center justify-center`}>
                        <div className={`w-4 h-4 border-2 ${{error: 'border-red-500', synced: 'border-emerald-500', pending: 'border-yellow-500'}[status]} rounded-full`}></div>
                    </div>
                </div>
                <div className="flex flex-col ml-4 w-full">
                    <h1 className="text-[0.7rem] text-slate-200">{document.id}. {directory?.name}</h1>
                    <h2 className="text-[0.6rem] text-slate-600 mt-[0.1rem]">{organization?.name}</h2>
                </div>
            </div>
            })}
        </div>
    </div>
}

export default SyncQueue;