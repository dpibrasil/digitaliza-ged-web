import { useField } from "@unform/core";
import { useEffect, useState } from "react";
import { IoFolder } from "react-icons/io5";
import api from "../services/api";

function SelectStoragePath({name}: any)
{
    const [path, setPath] = useState<string|undefined>()
    const [dirs, setDirs] = useState<{path: string, name: string}[]>([])
    const [selectedPath, setSelectedPath] = useState<string|undefined>()

    const { fieldName, defaultValue, registerField, error } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedPath,
            setValue: setSelectedPath,
            clearValue: () => setSelectedPath(undefined)
        })
    }, [fieldName, registerField, selectedPath])

    useEffect(() => {
        api.get('/path', {params: {path}})
        .then(({data}) => {
            setDirs(data.data)
            setSelectedPath(undefined)
        })
    }, [path])

    return <div className="">
        <h1>{path}</h1>
        <div className="grid grid-cols-4 gap-y-3 gap-x-1 max-h-[300px] overflow-y-auto">
            {dirs.map(dir => <div
                key={dir.name}
                className="flex items-center justify-center flex-col"
                onClick={() => setSelectedPath(dir.path)}
                onDoubleClick={() => setPath(dir.path)}
            >
                <div className={dir.path === selectedPath ? 'w-16 h-16 rounded-lg bg-blue-500 text-white flex items-center justify-center' : 'w-16 h-16 rounded-lg hover:bg-blue-200 bg-white text-slate-300 hover:text-slate-100 flex items-center justify-center'}>
                    <IoFolder size={36} />
                </div>
                <h1 className="text-xs mt-2 max-w-[100px] text-center select-none">{dir.name}</h1>
            </div>)}
        </div>
    </div>
}

export default SelectStoragePath;