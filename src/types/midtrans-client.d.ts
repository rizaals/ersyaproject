declare module 'midtrans-client' {
  interface SnapOptions {
    isProduction?: boolean
    serverKey: string
    clientKey?: string
  }

  interface TransactionDetails {
    order_id: string
    gross_amount: number
  }

  interface CustomerDetails {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }

  interface ItemDetail {
    id: string
    name: string
    price: number
    quantity: number
  }

  interface SnapParameter {
    transaction_details: TransactionDetails
    customer_details?: CustomerDetails
    item_details?: ItemDetail[]
    [key: string]: unknown
  }

  interface SnapTransaction {
    token: string
    redirect_url: string
  }

  class Snap {
    constructor(options: SnapOptions)
    createTransaction(parameter: SnapParameter): Promise<SnapTransaction>
  }

  class CoreApi {
    constructor(options: SnapOptions)
  }

  export { Snap, CoreApi }
}
