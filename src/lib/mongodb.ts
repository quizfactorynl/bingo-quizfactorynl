import { MongoClient } from "mongodb";
const uri = process.env.NEXT_PUBLIC_MONGO_URL as string;

if (!process.env.NEXT_PUBLIC_MONGO_URL) {
  throw new Error("Add Mongo URI to .env.local");
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;

export const COLLECTIONS = {
  BINGOS: "bingos",
  MUSICS: "musics",
  REF_CODES: "ref-codes",
};

/*NEXT_PUBLIC_apiKey=AIzaSyAh--41i_Ry4Yr4tbvFrequ25EhcIQ4hUs
NEXT_PUBLIC_authDomain=bingo-project-6fad0.firebaseapp.com
NEXT_PUBLIC_projectId=bingo-project-6fad0
NEXT_PUBLIC_storageBucket=bingo-project-6fad0.appspot.com
NEXT_PUBLIC_messagingSenderId=509704318165
NEXT_PUBLIC_appId=1:509704318165:web:fa54a1367e5bbb038a865c
NEXT_PUBLIC_measurementId=G-EPTV28H7EL
NEXT_PUBLIC_MONGO_URL=mongodb+srv://admin:n.3CiFpJ9JGZxh\$@cluster0.usggwa4.mongodb.net?retryWrites=true&w=majority
*/
