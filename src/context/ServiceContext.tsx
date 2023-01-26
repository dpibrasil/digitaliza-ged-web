import axios, { AxiosInstance } from "axios";
import { createContext, useContext } from "react";
import { useQuery } from "react-query";

interface ServiceContextType {
    scanners: any[],
    isError: boolean,
    api: AxiosInstance
}

const ServiceContext = createContext<ServiceContextType>({} as ServiceContextType)

export function ServiceProvider(props: any)
{
    const api = axios.create({baseURL: process.env.REACT_APP_SERVICE_API_BASE_URL})

    const {data: scanners, isSuccess} = useQuery('@scanners', async () => (await api.get('/GetSources')).data)

    return <ServiceContext.Provider value={{isError: !isSuccess, scanners, api}}>
        {props.children}
    </ServiceContext.Provider>
}

export const useAgentService = () => useContext(ServiceContext) 