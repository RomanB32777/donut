export const contractAddress = "TX6dd8YNKRCKZazcBZUHZQjyckzxvPKYJU"
export const contractMetaAddress = "0x07172d9b25477a047db638b82629d97e9bb9ddca";
export const abiOfContract = [
    {
        "inputs":[],
        "stateMutability": "nonpayable",
        "type":"constructor"
    },
    {
        "inputs":
        [
            {
                "internalType": "address",
                "name":"_creator",
                "type":"address"
            }
        ],
        "name":"transferMoney",
        "outputs":[],
        "stateMutability":"payable",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"withdrawPendingBalance",
        "outputs":[],
        "stateMutability":"payable",
        "type":"function"
    },
    {
        "stateMutability":
        "payable",
        "type":
        "receive"
    }
]

export const soundsList = ["money.mp4", "fanfan.mp4", "cash.mp4"];

export const url = '/images/'
