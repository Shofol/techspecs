// posts.js

import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("v4");
  let bodyObject = req.body ? JSON.parse(req.body) : {};
  switch (req.method) {
    case "POST":
      await db.collection("schemas").insertOne(bodyObject.value);
      res.json(bodyObject.value);
      break;
    // case "DELETE":
    //   const entriesToDelete = bodyObject.value.map((entry: any) => ({
    //     "Product.Category": { $eq: `${entry}` },
    //   }));
    //   await db.collection("products").deleteMany({
    //     $or: entriesToDelete,
    //   });
    //   res.json({ status: 200, data: bodyObject.value });
    //   break;
    case "GET":
      const schemas = await db
        .collection("schemas")
        .find({ "data.type": "addProduct" })
        .toArray();
      res.json({ status: 200, data: schemas });
      break;
  }
}
