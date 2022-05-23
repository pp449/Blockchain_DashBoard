import { Contract, AbiItem } from "caver-js";
import { getDefaultCaver } from "../constants";
import { ERC20 as erc20ABI } from "../abi";

const caver = getDefaultCaver();

class ERC20 {
    readonly name: string;

    readonly address: string;

    readonly image: string;

    readonly decimal: number;
    
    readonly contract: Contract;

    constructor(tokenName: string, address: string, decimal: number, image: string) {
      this.name = tokenName;
      this.address = address;
      this.image = image;
      this.decimal = decimal;
      // eslint-disable-next-line new-cap
      this.contract = new caver.contract(erc20ABI as AbiItem[], address);
    }

    async balanceOf(address: string): Promise<number> {
      console.log("qq: ",await this.contract.methods.balanceOf(address).call())
      return (await this.contract.methods.balanceOf(address).call()) / 10**this.decimal;
      // return (await this.contract.methods.balanceOf(address).call()) / Math.pow(10, this.decimal);
    } 

    // async transfer(from: string, to: string, amount: number) {
    //   const gasUnitPrice = await caver.klay.getGasPrice();
    //   const estimatedGas = await this.contract.methods.transfer(from, to, amount).estimateGas({
    //     from: from
    //   });

    //   await this.contract.methods.transfer(from, to, amount).send({
    //     from: from,
    //     gas: estimatedGas,
    //     gasPrice: gasUnitPrice
    //   })
    // }
}

export default ERC20;