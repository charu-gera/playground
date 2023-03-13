import { Asset, Server, ServerApi } from "stellar-sdk";

import { Record, findMemo } from "./find";

const server: Server = new Server("https://horizon-testnet.stellar.org");

const issuer = "GBG6URG62P5LR4YBMQLUHCGMDHICMJDCBKOLAQYHO2KGOHCOP4FIFXJX";
const dist = "GBGNSAQAU7HZLE7SPR6LCY3LSORD2TV3I2Y647LDUIE2CCKKOALOKEP6";

// const record_date: string = "2023-03-02T07:09:04Z"; //(https://stellar.expert/explorer/testnet/op/5502875308421121)
// const kmemo = "3214903412";
// txhash= '28a0802acdba22b692d101f8c8216fb8bb610aaa50d1b9159c70f20c0a267349';

const record_date: string = "2023-02-17 00:58:08 UTC"; //https://stellar.expert/explorer/testnet/tx/4566057041793024#4566057041793025)
const kmemo = "dswHXagyk/Y7mjm+a04/kUGm08aYpubPGvzsmatwA6s="; //"76cc075da83293f63b9a39be6b4e3f9141a6d3c698a6e6cf1afcec99ab7003ab";
// txhash= '6642225efec0275efca8974786b4f871f26c4dd74e280f0d58387b81540a966b';

const run = async () => {
  const memopage: Record = await findMemo(issuer, kmemo, record_date);
  console.log("--------------------Find ---------------------------");
  console.log("memopages", memopage);
};

run();
