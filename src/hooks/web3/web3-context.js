import React, {useState, useContext, useMemo, useCallback} from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { DEFAULT_NETWORK, Networks } from "../../constants";
import { getMainnetURI } from "./helpers";

const Web3Context = React.createContext(null);

export const useWeb3Context = () => {
    const web3Context = useContext(Web3Context);
    if(!web3Context){
        throw new Error("useWeb3Context() can be only be used inside of <Web3ContextProvider /> please declare it at a higher level.");
    }
    const { onChainProvider } = web3Context;
    return useMemo(()=> {
        return {...onChainProvider };
    },[web3Context]);
};

export const Web3ContextProvider = ({children}) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [uri, setUri] = useState(getMainnetURI());
    const [provider, setProvider] = useState(new StaticJsonRpcProvider(uri));
    const [providerChainID, setProviderChainID] = useState(DEFAULT_NETWORK);

    const [web3Modal] = useState(
        new Web3Modal({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        rpc: {
                            [Networks.KLAY]: getMainnetURI(),
                        },
                    },
                },
            },
        }),
    );

    const hasCachedProvider = () => {
        if (!web3Modal) return false;
        if (!web3Modal.cachedProvider) return false;
        return true;
    }

    const _initListeners = useCallback(
        (rawProvider) => {
            if(!rawProvider.on){
                return;
            }

            rawProvider.on("accountsChanged", () => setTimeout(()=> window.location.reload(),1));

            rawProvider.on("chainchanged", async (chain) => {
                changeNetwork(chain);
            });

            rawProvider.on("network", (_newNetwork, oldNetwork) => {
                if (!oldNetwork) return;
                window.location.reload();
            });
        },
        [provider],
    );

    const changeNetwork = async(otherChainID) => {
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

        if(chainId === Networks.KLAY){
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