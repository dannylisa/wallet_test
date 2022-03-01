export const fAddress = (
    address: string, 
    head?: number, 
    tail?: number
) => `${address.slice(0,head || 6)}...${address.slice(-(tail || 4))}`
