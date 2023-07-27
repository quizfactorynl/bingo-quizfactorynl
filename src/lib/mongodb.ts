import { MongoClient } from 'mongodb'
const uri = process.env.NEXT_PUBLIC_MONGO_URL as string

if (!process.env.NEXT_PUBLIC_MONGO_URL) {
  throw new Error('Add Mongo URI to .env.local')
}

const client = new MongoClient(uri)
const clientPromise = client.connect()

export default clientPromise;


export const COLLECTIONS = {
  BINGOS: 'bingos',
  MUSICS: 'musics',
  REF_CODES: 'ref-codes'
}


