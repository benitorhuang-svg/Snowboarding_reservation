export interface TapPayResponse {
  status: number;
  msg: string;
  rec_trade_id: string;
}

export interface LinePayResponse {
  returnCode: string;
  returnMessage: string;
  info: {
    paymentUrl: {
      web: string;
      app: string;
    };
    transactionId: string;
  };
}

export interface WebhookData {
  order_id: string;
  rec_trade_id: string;
  status: number;
}
