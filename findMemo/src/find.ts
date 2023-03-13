import { Asset, Server, ServerApi } from "stellar-sdk";

const server: Server = new Server("https://horizon-testnet.stellar.org");
export type Record = ServerApi.OperationRecord;

const searchCriteria = async (
  record: Record,
  asset: Asset,
  kmemo: string,
  record_date: string
) => {
  if (
    record.source_account === asset.issuer &&
    record.type === "payment" &&
    record.asset_code === asset.code &&
    new Date(record.created_at) >= new Date(record_date)
  ) {
    const tx = await record.transaction();
    if (tx.memo === kmemo) {
      console.log(" found memo", record.transaction_hash);
      return true;
    }
  }
};

export const findMemo = async (
  asset: Asset,
  kmemo: string,
  record_date: string
): Promise<Record> => {
  let page = await server
    .operations()
    .forAccount(asset.issuer)
    .order("desc")
    .limit(30)
    .call();
  let filtered: Record[] = [];
  let memo_record: Record = {} as Record;
  let found: boolean = false;
  while (page.records.length && !found) {
    filtered = [];
    filtered = page.records.filter(async (record) => {
      const f = await searchCriteria(record, asset, kmemo, record_date);
      if (f) {
        found = f;
        memo_record = record;
        return found;
      }
    });

    if (!found) page = await page.next();
    console.log("found - ", found);
  }
  return memo_record;
};
