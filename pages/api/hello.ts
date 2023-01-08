// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../lib/mongodb";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const client = await clientPromise;
    const db = client.db("v4");
    const movies: any = await db
      .collection("Product")
      .find({})
      .sort({ metacritic: -1 })
      .skip(20)
      .limit(20)
      .toArray();

    res.json(movies);
  } catch (e) {
    console.error(e);
  }
}
