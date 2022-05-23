import React, {useState, useContext, useMemo, useCallback, ReactElement} from "react";
import Web3Modal from "web3modal";
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { DEFAULT_NETWORK, getNetworkNumber, getRpcUrl, NETWORK } from "../../constants";
import { getMainnetURI, getEthereumURI } from "./helpers";

// DEAFULT_NETWORK = 8545, Networks = { CYPRESS: 8545, BAOBAB: 1001 }, getMainnetURI = "https://api.baobab.klaytn.net:8651/"


type onChainProvider = {
    connect: () => Promise<Web3Provider>;
    disconnect: () => void;
    provider: any;
    address: string;
    connected: Boolean;
    web3Modal: Web3Modal;
    providerChainID: number;
    hasCachedProvider: () => boolean;
}

export type Web3ContextData = {
    onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
    const web3Context = useContext(Web3Context);
    if (!web3Context) {
        throw new Error("useWeb3Context() can only be used inside of <Web3ContextProvider />, please declare it at a higher level.");
    }
    const { onChainProvider } = web3Context;
    return useMemo(() => {
        return { ...onChainProvider };
    }, [web3Context]);
};

export const Web3ContextProvider:React.FC<{ children: ReactElement }> = ({children}) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [uri, setUri] = useState(getMainnetURI());
    const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));
    const [providerChainID, setProviderChainID] = useState(NETWORK.CYPRESS);

    const [web3Modal] = useState(
        new Web3Modal({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        rpc: {
                            [NETWORK.CYPRESS]: getRpcUrl(providerChainID),
                        },
                    },
                },
            },
        }),
    );

    const hasCachedProvider = (): boolean => {
        if (!web3Modal) return false;
        if (!web3Modal.cachedProvider) return false;
        return true;
    }

    const _initListeners = useCallback(
        (rawProvider: JsonRpcProvider) => {
            if(!rawProvider.on){
                return;
            }

            rawProvider.on("accountsChanged", () => setTimeout(()=> window.location.reload(),1));

            rawProvider.on("chainchanged", async (chain:number) => {
                changeNetwork(chain);
            });

            rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
                if (!oldNetwork) return;
                window.location.reload();
            });
        },
        [provider],
    );

    const changeNetwork = async(otherChainID: number) => {
        const network = Number(otherChainID);

        setProviderChainID(network);
    }

    const connect = useCallback(async () => {
        const rawProvider = await web3Modal.connect();

        _initListeners(rawProvider);

        const connectedProvider = new Web3Provider(rawProvider, "any");

        const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
        const connectedAddress = await connectedProvider.getSigner().getAddress();

        setAddress(connectedAddress);

        setProviderChainID(chainId);

        if(chainId === getNetworkNumber(providerChainID)){
            setProvider(connectedProvider);
        }
        setConnected(true);

        return connectedProvider;
    }, [provider,web3Modal, connected]);

    const disconnect = useCallback(async () => {
        web3Modal.clearCachedProvider();
        setConnected(false);

        setTimeout(()=> {
            window.location.reload();
        },1);
    }, [provider, web3Modal, connected]);

    const onChainProvider = useMemo(
        () => ({
            connect,
            disconnect,
            hasCachedProvider,
            provider,
            connected,
            address,
            web3Modal,
            providerChainID
        }),
        [connect,disconnect,hasCachedProvider, provider, connected, address, web3Modal, providerChainID],
    );
    return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>
}