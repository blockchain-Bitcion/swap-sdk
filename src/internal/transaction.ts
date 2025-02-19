import { AddressType, PoolInfo, PoolDirectionType, PositionInfo } from "./common";

export type TransacationNormalizedArgument = ["address" | "string", string] | ["u8" | "u16" | "u32" | "u64" | "u128", number | bigint];
export type TransacationArgument = string | number | bigint | TransacationNormalizedArgument;

export type TransactionOperationType_SwapType = "swap";
export type TransactionOperationType_AddLiqudityType = "add-liqudity";
export type TransactionOperationType_RemoveLiquidityType = "remove-liqudity";
export type TransactionOperationType_MintTestCoinType = "mint-test-coin";
export type TransactionOperationType_RawType = "raw";

export interface TransactionType {
    function: string;
    type_arguments: string[];
    arguments: TransacationArgument[];
}

export interface TransactionTypeSerializeContext {
    packageAddr: AddressType;
    sender: AddressType;
}

export interface TransactionOptions {
    maxGasAmount?: bigint;
    gasUnitPrice?: bigint;
    expirationSecond?: number;
}

export interface TransactionOperation_SwapProps {
    operation: TransactionOperationType_SwapType;
    pool: PoolInfo;
    direction: PoolDirectionType;
    amount: bigint;
    minOutputAmount?: bigint;
};

export interface TransactionOperation_AddLiqudityProps {
    operation: TransactionOperationType_AddLiqudityType;
    pool: PoolInfo;
    xAmount: bigint;
    yAmount: bigint;
};

export interface TransactionOperation_RemoveLiquidityProps {
    operation: TransactionOperationType_RemoveLiquidityType;
    positionInfo: PositionInfo
}

export interface TransactionOperation_MintTestCoinProps {
    operation: TransactionOperationType_MintTestCoinType;
    amount: bigint;
}

export interface TransactionOperation_Raw {
    operation: TransactionOperationType_RawType;
    transaction: TransactionType;
}

export type TransactionOperation_Any = (
    TransactionOperation_SwapProps | 
    TransactionOperation_AddLiqudityProps |
    TransactionOperation_RemoveLiquidityProps | 
    TransactionOperation_MintTestCoinProps |
    TransactionOperation_Raw
);

export type TransactionOperationType_AnyType = (
    TransactionOperationType_SwapType | 
    TransactionOperationType_AddLiqudityType |
    TransactionOperationType_RemoveLiquidityType | 
    TransactionOperationType_MintTestCoinType |
    TransactionOperationType_RawType
);

export declare namespace TransactionOperation {
    export {
        TransactionOperation_SwapProps as Swap,
        TransactionOperation_AddLiqudityProps as AddLiqudity,
        TransactionOperation_RemoveLiquidityProps as RemoveLiquidity,
        TransactionOperation_MintTestCoinProps as MintTestCoin,
        TransactionOperation_Raw as Raw,
        TransactionOperation_Any as Any,

        TransactionOperationType_SwapType as SwapType,
        TransactionOperationType_AddLiqudityType as AddLiqudityType,
        TransactionOperationType_RemoveLiquidityType as RemoveLiquidityType,
        TransactionOperationType_MintTestCoinType as MintTestCoinType,
        TransactionOperationType_RawType as RawType,
        TransactionOperationType_AnyType as AnyType
    }
}

export class TransactionArgumentHelper {
    static normalizeTransactionArgument = (v: TransacationArgument, ctx: TransactionTypeSerializeContext) => {
        let vs: any = v;
        if (typeof v === "string") {
            vs = (v.startsWith("0x") || v === "@" || v === "$sender")  ? ["address", v] : ["string", v];
        }
        else if (typeof v === "number") {
            vs = ["u64", v];
        }
        else if (typeof v === "bigint") {
            vs = ["u64", v];
        }
        else {
            vs = v;
        }
    
        // Speical hanlding for address
        if (vs[0] === "address") {
            let valueStr = vs[1].toString();
    
            // Use @ to replace current package addr
            if (valueStr === "@") {
               vs[1] = ctx.packageAddr;
            }
            else if (valueStr === "$sender") {
                vs[1] = ctx.sender;
            }
        }
    
        return vs as TransacationNormalizedArgument;
    }
}