import Caver from "caver-js";

export enum NETWORK {
    CYPRESS,
    BAOBAB,
}

export const getNetworkNumber = (network: NETWORK): number => {
    if(network === NETWORK.BAOBAB) {
        return 1001;
    } 
    return 8217;
}

export const getRpcUrl = (network: NETWORK): string => {
    if(network === NETWORK.BAOBAB) {
        return "https://public-node-api.klaytnapi.com/v1/baobab";
    }
    return "https://public-node-api.klaytnapi.com/v1/cypress";
}

export const getCaver = (network: NETWORK): Caver => {
    return new Caver(getRpcUrl(network));
}

export const getDefaultNetworkNumber = (): number => {
    return getNetworkNumber(DEFAULT_NETWORK);
}

export const getDefaultRpcUrl = (): string => {
    return getRpcUrl(DEFAULT_NETWORK);
}

export const getDefaultCaver = (): Caver => {
    return getCaver(DEFAULT_NETWORK);
}


export const DEFAULT_NETWORK = NETWORK.CYPRESS;

