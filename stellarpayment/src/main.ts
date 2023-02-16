import { Server , Keypair, Asset} from 'stellar-sdk';//
import * as accounts from './accounts';


console.log("Hello Stellar world")

let server: Server = new Server("https://horizon-testnet.stellar.org");
//console.log(server.serverURL);


//const localRootAccount: string = "GA7RS4XNJBYA53GM5Q4GH7UF2HORGONY2L644DM3EEHF2MVRLNZY6EB4";
const localRootAccountSecret: string = "SCTAOMRWT6P7JJFIN43BW7DM37JREMBV6GEMGRAU3LARUMGBNBCADF6U";

const localRoot = Keypair.fromSecret(localRootAccountSecret);

const main = async (parentKey: Keypair): Promise<void> => {
    const  issuerKeypair: Keypair = Keypair.random()
    const  sourceKeypair: Keypair = Keypair.random();
    const  destinationKeypair : Keypair = Keypair.random();

    await accounts.createAccount(parentKey, issuerKeypair);
    await accounts.createAccount(parentKey, sourceKeypair);
    await accounts.createAccount(parentKey, destinationKeypair);

console.log("Issuer :  [", issuerKeypair.publicKey(), " , ", issuerKeypair.secret(), "]");
console.log("Source :  [", sourceKeypair.publicKey(), " , ", sourceKeypair.secret(), "]");
console.log("Destination :  [", destinationKeypair.publicKey  (), " , ", destinationKeypair.secret(), "]");

    const asset = new Asset("XAU", issuerKeypair.publicKey());

    await accounts.establishtrustlines(sourceKeypair,asset);
    await accounts.establishtrustlines(destinationKeypair, asset);
    console.log("Asset [",asset.code,":",asset.issuer,"]");

    let issueamount=500, transferamount=200;
    console.log(issueamount, " ",asset.code, " issued to ",    sourceKeypair.publicKey(), " is ", 
            ((await accounts.paymentAsset(issuerKeypair,sourceKeypair,asset, issueamount)).successful));
    console.log(transferamount, " ",asset.code, " transfered from ",sourceKeypair.publicKey(), " to ", destinationKeypair.publicKey(), "is",
            ((await accounts.paymentAsset(sourceKeypair,destinationKeypair,asset, transferamount)).successful));
  
}


main(localRoot);