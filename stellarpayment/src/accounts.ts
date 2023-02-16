
import { Server , Keypair, TransactionBuilder, BASE_FEE, Networks, Operation, Transaction, Asset} from 'stellar-sdk';



const server: Server = new Server("https://horizon-testnet.stellar.org");


export const createAccount = async (parentKey:Keypair, childKey:Keypair): Promise<Keypair>  => {
    
    let parentAccount = await server.loadAccount(parentKey.publicKey());

    const createAccountOperation = Operation.createAccount({
        destination: childKey.publicKey(),
        startingBalance: "1000"
      });

    const transaction:Transaction = (new TransactionBuilder(parentAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      }))
      .addOperation(createAccountOperation)
      .setTimeout(180)
      .build();

    transaction.sign(parentKey);

    const txHash:string = transaction.hash().toString('hex')
    await server.submitTransaction(transaction, { skipMemoRequiredCheck: true })
      .catch((e) => {
      //  console.log(`Error submitting transaction: ${txHash}\n${JSON.stringify(e.response.data.extras, null, 2)}`)
      console.log(`Error submitting transaction: ${txHash}`);

        throw e
      })
    return childKey;

}


export const establishtrustlines = async(accountKey:Keypair, asset:Asset) => {

    const account = await server.loadAccount(accountKey.publicKey());

    const changeTrustOperation = Operation.changeTrust({
      asset: asset,
      limit: "1000"
    });

    const transaction:Transaction = (new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    }))
    .addOperation(changeTrustOperation)
    .setTimeout(180)
    .build(); 


    transaction.sign(accountKey);
    return await server.submitTransaction(transaction);
}


export const paymentAsset = async(source:Keypair, destination:Keypair, asset: Asset, amount:number) => {

    const sourceAccount = await server.loadAccount(source.publicKey());

    const paymentOperation = Operation.payment({
      destination:destination.publicKey(),
      asset: asset,
      amount:amount.toString()
    });

    const transaction:Transaction = (new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    }))
    .addOperation(paymentOperation)
    .setTimeout(180)
    .build(); 


    transaction.sign(source);
    return await server.submitTransaction(transaction);


}



/*
Public Key	GBHL3DAJEGUWWGC55QPYKJOXBWSFIIIAE2OFWPB6BXIDO72YZPZSQJES
Secret Key	SB2OHX4UTELHR4QHTAFIONGJMUIKQEQ6CGYD3WNIGTSXOF7UFLAPF53A
*/

const  fundAccount = async (publicKey: string):Promise<void> => {
  const  endpoint = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`;
  try
  { 
      const response = await fetch(endpoint) ;
      const  responseJSON = await  response.json();
      console.log("SUCCESS! You have a new account :)\n", responseJSON);

  } catch (e) {
      console.error("ERROR!", e);
  }
}






