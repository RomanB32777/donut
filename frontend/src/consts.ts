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

export const filterPeriodItems: { [key: string]: string } = { 
    "today": "Today" ,
    "7days": "Last 7 days" , 
    "30days": "Last 30 days" ,
    "year": "This year" 
}

export const filterCurrentPeriodItems: { [key: string]: string } = { 
    "yesterday": "Yesterday",
    "today": "Today" ,
    "7days": "Current week" , 
    "30days": "Current month" ,
    "year": "Current year",
    "all": "All time",
    "custom": "Custom date",
}

export const url = '/images/'
