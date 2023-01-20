import { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";
import api, { catchApiErrorMessage } from "../services/api";
import { DirectoryIndexType, IndexListValueType } from "../types/OrganizationTypes";
import { Input } from "./Input";

function DirectoryIndexOptionsEdit(props: {index?: DirectoryIndexType})
{
    const [currentOptions, setCurrentOptions] = useState<IndexListValueType[]>()
    const [editingOptions, setEditingOptions] = useState<number[]>([])

    const addOption = () => setEditingOptions([...editingOptions, editingOptions.length ? Math.max(...editingOptions) + 1 : 1])
    const removeOption = (i: number) => setEditingOptions(editingOptions.filter(o => o !== i))

    useEffect(() => {
        if (props.index && props.index.id) {
            api.get('/directory-indexes/' + props.index.id + '/list-values')
            .then(({data}) => setCurrentOptions(data))
            .catch(err => catchApiErrorMessage(err))
        }
    }, [props.index])

    return <div className="grid grid-flow-row gap-2 mb-3 w-full">
        <label className="text-xs font-semibold mb-1 text-primary-text">Lista criada</label>
        <div className="grid grid-flow-row gap-y-2 max-h-24 overflow-y-auto">
            {currentOptions && currentOptions.map(option => <div key={option.id} className="flex items-center justify-between w-full text-neutral-900">
                <h1 className="rounded bg-neutral-100 py-2 w-full px-3 text-xs">{option.value}</h1>
            </div>)}
            {editingOptions.map(i => <div key={i} className="flex items-center justify-between w-full text-neutral-900">
                <Input name={`index.listOptions[${i}].value`} />
                <div onClick={() => removeOption(i)} className="bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center w-8 h-8 rounded ml-2 cursor-pointer mb-2">
                    <IoTrash />
                </div>
            </div>)}
        </div>
        <button onClick={addOption} type="button" className="bg-emerald-500 hover:bg-emerald-600 rounded w-full py-3 text-sm text-white">Adicionar opção</button>
    </div>
}

export default DirectoryIndexOptionsEdit;