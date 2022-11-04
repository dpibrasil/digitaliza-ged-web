export function downloadBase64(data: string, name: string)
{
    const link = window.document.createElement('a')
    link.href = data
    link.setAttribute('download', name)
    window.document.body.appendChild(link)
    link.click()

    if (link.parentNode) link.parentNode.removeChild(link)
}

export function downloadData(data: string, name: string)
{
    const blob = new File([data], name)
    const objURL = window.URL.createObjectURL(new Blob([blob]),)
    const link = window.document.createElement('a')
    link.href = objURL
    link.setAttribute('download', name)
    window.document.body.appendChild(link)
    link.click()

    if (link.parentNode) link.parentNode.removeChild(link)
}