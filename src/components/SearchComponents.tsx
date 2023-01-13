import React from "react";
import { IoChevronBack, IoChevronForward, IoCreateOutline, IoDownloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { displayIndex } from "../services/helpers";
import { DirectoryIndexType } from "../types/OrganizationTypes";
import { SelectInput } from "./Input";

export function ResultsTable({searchResult}: {searchResult: any})
{
    const navigate = useNavigate()
    if (searchResult.total === 0) return <h1 className="text-base text-center">Nenhum resultado encontrado.</h1>


    function handleChangeAllCheckboxes(event: any)
    {
        const inputs: any = document.querySelectorAll('input[type="checkbox"][name="search-documents"]')
        inputs.forEach((input: any) => {
            input.checked = event.target.checked
        })
    }

    return <table id="search-results" className="w-full text-sm">
        <thead>
            <tr>
                <th>
                    <input type="checkbox" onChange={handleChangeAllCheckboxes} />
                </th>
                <th>ID</th>
                {searchResult.indexes.map((index: DirectoryIndexType) => <th key={index.id}>{index.name}</th>)}
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {searchResult.results.map((result: any) => <tr key={result.documentId}>
                <th>
                    <input type="checkbox" name="search-documents" value={result.documentId} />
                </th>
                <th>{result.documentId}</th>
                {searchResult.indexes.map((index: DirectoryIndexType) => <td key={index.id}>{displayIndex(index, result[index.id])}</td>)}
                <td className="grid auto-col-max grid-flow-col justify-start gap-x-1">
                    <div className="w-min bg-neutral-100 text-blue-500 p-1 rounded">
                        <IoDownloadOutline />
                    </div>
                    <div onClick={() => navigate('/documents/' + result.documentId)} className="w-min bg-neutral-100 text-blue-500 p-1 rounded">
                        <IoCreateOutline />
                    </div>
                </td>
            </tr>)}
        </tbody>
    </table>
}

export function Pagination({searchResult, changePagination}: {searchResult: any, changePagination: any})
{
    function changePage(i: number) {
        if (i > searchResult.lastPage || i <= 0) {
            return false
        }
        changePagination(i)
    }

    return <div className="w-full mt-3 flex flex-row justify-between items-center">
        <div className="grid grid-flow-col auto-col-max items-center">
            <SelectInput name="pageLimit">
                <option>25</option>
                <option>50</option>
                <option>75</option>
                <option>100</option>
                <option>200</option>
                <option>250</option>
                <option>500</option>
                <option>1000</option>
                <option>2000</option>
                <option>100000</option>
            </SelectInput>
            <h1 className="w-auto text-sm text-neutral-400">Mostrando página {searchResult.currentPage}/{searchResult.lastPage} de {searchResult.total} resultado{searchResult.total !== 1 && 's'}</h1>
        </div>
        <div className="grid auto-col-max grid-flow-col gap-x-1 items-center text-neutral-500">
            <IoChevronBack onClick={() => changePage(searchResult.currentPage - 1)} />
                {searchResult.currentPage !== 2 && <div className={`w-min ${1 === searchResult.currentPage ? 'bg-blue-500 text-white' : 'bg-neutral-100'} p-1 rounded text-[11px] font-semibold h-7 w-5 flex items-center justify-center cursor-pointer`} onClick={() => changePage(1)}>1</div>}
                {Array.from(Array(searchResult.lastPage - searchResult.currentPage > 2 ? 3 : searchResult.lastPage + 1 - searchResult.currentPage).keys()).map(i => {
                    const pageNumber = i + searchResult.currentPage - (searchResult.currentPage === 1 ? -1 : 1)
                    return <div key={i} className={`w-min ${pageNumber === searchResult.currentPage ? 'bg-blue-500 text-white' : 'bg-neutral-100'} p-1 rounded text-[11px] font-semibold h-7 w-5 flex items-center justify-center cursor-pointer`} onClick={() => changePage(pageNumber)}>{pageNumber}</div>
                })}
                <div className={`w-min ${searchResult.lastPage === searchResult.currentPage ? 'bg-blue-500 text-white' : 'bg-neutral-100'} p-1 rounded text-[11px] font-semibold h-7 w-5 flex items-center justify-center cursor-pointer`} onClick={() => changePage(searchResult.lastPage)}>{searchResult.lastPage}</div>
            <IoChevronForward onClick={() => changePage(searchResult.currentPage + 1)} />
        </div>
    </div>
}