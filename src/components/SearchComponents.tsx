import React from "react";
import { IoChevronBack, IoChevronForward, IoCreateOutline, IoDownloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { downloadData } from "../services/download";
import { displayIndex } from "../services/helpers";
import { DirectoryIndexType } from "../types/OrganizationTypes";
import { SelectInput, SelectItem } from "./Input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function ResultsTable({searchResult}: {searchResult: any})
{
    const navigate = useNavigate()

    function handleChangeAllCheckboxes(event: any)
    {
        const inputs: any = document.querySelectorAll('input[type="checkbox"][name="search-documents"]')
        inputs.forEach((input: any) => {
            input.checked = event.target.checked
        })
    }

    async function handleDownload(id: number) {
        const response = await api.get(`/documents/${id}/file`, { responseType: 'blob' })
        downloadData(response.data, `${id}.pdf`)
    }

    if (searchResult.total === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                <svg className="w-12 h-12 mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium">Nenhum resultado encontrado</p>
                <p className="text-xs mt-1">Tente ajustar os filtros de pesquisa</p>
            </div>
        )
    }

    const indexes = searchResult.indexes.sort((x: any, y: any) => (x.id - y.id))

    return (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table id="search-results" className="w-full text-sm">
                <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="py-3 px-4 text-left w-10">
                            <input type="checkbox" onChange={handleChangeAllCheckboxes} className="rounded" />
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-neutral-500 whitespace-nowrap uppercase text-xs">ID</th>
                        {indexes.map((index: DirectoryIndexType) => (
                            <th key={index.id} className="py-3 px-4 text-left font-medium text-neutral-500 whitespace-nowrap uppercase text-xs">{index.name}</th>
                        ))}
                        <th className="py-3 px-4 text-left font-medium text-neutral-500 whitespace-nowrap uppercase text-xs">Páginas</th>
                        <th className="py-3 px-4 text-left font-medium text-neutral-500 whitespace-nowrap uppercase text-xs">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {searchResult.results.map((result: any, i: number) => (
                        <tr key={result.documentId} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                            <td className="py-3 px-4">
                                <input type="checkbox" name="search-documents" value={result.documentId} className="rounded" />
                            </td>
                            <td className="py-3 px-4 font-medium text-neutral-700">{result.documentId}</td>
                            {indexes.map((index: DirectoryIndexType) => (
                                <td key={index.id} className="py-3 px-4 text-neutral-600 whitespace-nowrap">{displayIndex(index, result[index.id])}</td>
                            ))}
                            <td className="py-3 px-4 text-neutral-600">{result.pages ?? 1}</td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost-blue"
                                        size="icon"
                                        onClick={() => handleDownload(result.documentId)}
                                        title="Baixar PDF"
                                    >
                                        <IoDownloadOutline size={15} />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost-blue"
                                        size="icon"
                                        onClick={() => navigate('/documents/' + result.documentId)}
                                        title="Ver documento"
                                    >
                                        <IoCreateOutline size={15} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
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
        <div className="grid grid-flow-col auto-col-max items-center gap-2">
            <SelectInput name="pageLimit" placeholder="25">
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="75">75</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="250">250</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
                <SelectItem value="2000">2000</SelectItem>
                <SelectItem value="100000">100000</SelectItem>
            </SelectInput>
            <p className="w-auto text-sm text-neutral-400">
                Mostrando página {searchResult.currentPage}/{searchResult.lastPage} de {searchResult.total} documento{searchResult.total !== 1 && 's'} · {searchResult.totalPages ?? 0} página{(searchResult.totalPages ?? 0) !== 1 && 's'} no total
            </p>
        </div>
        <div className="grid auto-col-max grid-flow-col gap-x-1 items-center text-neutral-500">
            <button type="button" onClick={() => changePage(searchResult.currentPage - 1)} className="p-1 hover:text-primary transition-colors">
                <IoChevronBack />
            </button>
            {searchResult.currentPage !== 2 && (
                <button
                    type="button"
                    className={cn(
                        'p-1 rounded text-xs font-semibold h-7 w-7 flex items-center justify-center transition-colors',
                        1 === searchResult.currentPage ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'
                    )}
                    onClick={() => changePage(1)}
                >
                    1
                </button>
            )}
            {Array.from(Array(searchResult.lastPage - searchResult.currentPage > 2 ? 3 : searchResult.lastPage + 1 - searchResult.currentPage).keys()).map(i => {
                const pageNumber = i + searchResult.currentPage - (searchResult.currentPage === 1 ? -1 : 1)
                return (
                    <button
                        key={i}
                        type="button"
                        className={cn(
                            'p-1 rounded text-xs font-semibold h-7 w-7 flex items-center justify-center transition-colors',
                            pageNumber === searchResult.currentPage ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'
                        )}
                        onClick={() => changePage(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                )
            })}
            <button
                type="button"
                className={cn(
                    'p-1 rounded text-xs font-semibold h-7 w-7 flex items-center justify-center transition-colors',
                    searchResult.lastPage === searchResult.currentPage ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'
                )}
                onClick={() => changePage(searchResult.lastPage)}
            >
                {searchResult.lastPage}
            </button>
            <button type="button" onClick={() => changePage(searchResult.currentPage + 1)} className="p-1 hover:text-primary transition-colors">
                <IoChevronForward />
            </button>
        </div>
    </div>
}
