import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import { useLocalStorage } from "react-use";
import Modal from "../components/Modal";
import { useAgentService } from "../context/ServiceContext";
import { catchApiErrorMessage } from "../services/api";
import { addPageByImages } from "../services/document-edit/pages/add";

const Platform: any = { 0: 'X86_32', 1: 'X86_64' }
const Version: any = { 0: 'V1', 1: 'V2' }
const Caps: any = {
    0x0101: 'IPixelType',
    0x1118: 'XResolution'
}
const CapValues: any = {
    IPixelType: (val: number) => ({0: 'BW', 1: 'Gray', 2: 'RGB', 3: 'Palette', 4: 'CMY', 5: 'CMYK', 6: 'YUV', 7: 'YUVK', 8: 'CIEXYZ', 9: 'LAB', 10: 'SRGB', 16: 'INFRARED'})[val],
    XResolution: (val: any) => val
}

function ScanModal()
{
    const {scanners, isError, api} = useAgentService()

    const [sourceId, setSourceId] = useLocalStorage<number|undefined>('@scanner-source-id')
    const source = scanners && scanners.find(scanner => scanner.Id == sourceId)
    const [caps, setCaps] = useState<any[]>()
    const [scannerAvailable, setScannerAvaliable] = useState(false)
    const [dpi, setDPI] = useLocalStorage('@scanner-dpi')
    const [imageType, setImageType] = useLocalStorage('@scanner-image-type')

    useEffect(() => {
        if (source) {
            const promise = api.get('/GetCaps', {params: {
                platform: Platform[source.Platform],
                version: Version[source.Version],
                sourceId,
                caps: "IPixelType,XResolution"
            }})
            toast.promise(promise, {
                loading: 'Carregando funcões do scanner...',
                success: ({data}) => {
                    const c = data.filter((cap: any) => !!Caps[cap.Cap]).map((cap: any) => {
                        return {
                            name: Caps[cap.Cap],
                            values: cap.Values.map((value: any) => ({value: value.RawValue, label: CapValues[Caps[cap.Cap]](value.Name)}))
                        }
                    })
                    setScannerAvaliable(!!c.length)
                    setCaps(c)
                    return 'Scanner carregado!'
                },
                error: (e) => {
                    setScannerAvaliable(false)
                    return catchApiErrorMessage(e)
                }
            })
        }
    }, [sourceId])

    function setShow(show: boolean)
    {
        const element = document.getElementById('scan-modal')
        element?.setAttribute('class', show ? '' : 'hidden')
    }

    async function handleSubmit()
    {
        const data = {
            platform: Platform[source.Platform],
            version: Version[source.Version],
            sourceId,
            caps: JSON.stringify({
                IPixelType: imageType,
                XResolution: dpi,
                YResolution: dpi
            })
        }
        const promise = api.get('/Acquire', {params: data})

        toast.promise(promise, {
            loading: 'Escaneando...',
            error: catchApiErrorMessage,
            success: ({data}) => {
                addPageByImages(['data:image/jpeg;base64,' + data])
                setShow(false)
                return 'Página importada.'
            }, 
        })

    }

    return <div className="hidden" id="scan-modal">
        {/* @ts-ignore */}
        <Modal setShow={setShow}>
            {isError ? <div className="flex flex-col items-center justify-center">
                <IoWarning size={48} className="text-yellow-400" />
                <h1 className="font-bold text-lg mt-2">Falha ao procurar scanners.</h1>
                <h2 className="font-normal text-sm mt-1">Você precisa instalar o serviço Digitaliza para continuar.</h2>
            </div> : <div className="grid grid-flow-row gap-y-3">
                <div>
                    <label className="text-xs font-semibold mb-1 text-primary-text">Selecione o scanner</label>
                    <select className="rounded bg-neutral-100 py-1 px-3 min-h-[35px] text-[12px] text-black w-full" onChange={(event) => setSourceId(Number(event?.target.value))}>
                        {scanners.map((scanner: any) => <option key={scanner.Id + '-' + scanner.Version} value={scanner.Id}>{scanner.Name} ({scanner.Version})</option>)}
                    </select>
                </div>
                {!scannerAvailable ? <p className="text-red-500 text-xs">O scanner selecionado está indisponível.</p> : <>
                    <div className="grid grid-flow-col gap-x-2">
                        <div className="grid grid-flow-row gap-y-1">
                            <label className="text-xs font-semibold text-primary-text">DPI</label>
                            <select className="rounded bg-neutral-100 py-1 px-3 min-h-[35px] text-[12px] text-black w-full" onChange={(event) => setDPI(event?.target.value)}>
                                {caps?.find((cap: any) => cap.name == 'XResolution')?.values.map((value: any) => <option key={value.value} value={JSON.stringify(value.value)}>{value.label}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-flow-row gap-y-1">
                            <label className="text-xs font-semibold text-primary-text">Tipo de imagem</label>
                            <select className="rounded bg-neutral-100 py-1 px-3 min-h-[35px] text-[12px] text-black w-full" onChange={(event) => setImageType(event?.target.value)}>
                                {caps?.find((cap: any) => cap.name == 'IPixelType')?.values.map((value: any) => <option key={value.value} value={JSON.stringify(value.value)}>{value.label}</option>)}
                            </select>
                        </div>
                    </div>
                </>}
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed rounded w-full py-3 text-sm text-white" disabled={!scannerAvailable}>Escanear agora</button>
            </div>}
        </Modal>
    </div>
}

export default ScanModal;