import { Asset, Server, ServerApi } from "stellar-sdk";

const server: Server = new Server("https://horizon-testnet.stellar.org");
export type Record = ServerApi.OperationRecord;
export type TxRecord = ServerApi.TransactionRecord;
//const record_date: string = "2023-03-02T07:09:04Z";

const searchCriteria = async (
  record: Record,
  issuer: string,
  kmemo: string,
  record_date: string
) => {
  if (
    record.source_account === issuer &&
    record.type === "payment" &&
    record.asset_code === "TCOIN" &&
    new Date(record.created_at) >= new Date(record_date)
  ) {
    const tx = await record.transaction();
    if (tx.memo === kmemo) {
      console.log(" found ", record.transaction_hash);
      return true;
    }
  }
};

export const findMemo = async (
  issuer: string,
  kmemo: string,
  record_date: string
): Promise<Record> => {
  let page = await server
    .operations()
    .forAccount(issuer)
    .order("desc")
    .limit(30)
    .call();
  let filtered: Record[] = [];
  let memo_record: Record = {} as Record;
  let found: boolean = false;
  while (page.records.length && !found) {
    filtered = [];
    filtered = page.records.filter(async (record) => {
      const f = await searchCriteria(record, issuer, kmemo, record_date);
      if (f) {
        found = f;
        memo_record = record;
        return found;
        //  return record;
      }
    });

    if (!found) page = await page.next();
    console.log("found - ", found);
  }
  //memo_record = filtered[0];
  return memo_record;
};
