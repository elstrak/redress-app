import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "stylehub"

if (!uri) {
  throw new Error("MONGODB_URI is not configured.")
}

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined
}

const clientPromise = global.mongoClientPromise || new MongoClient(uri).connect()

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}
