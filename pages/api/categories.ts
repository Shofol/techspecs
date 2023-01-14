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
    case "PUT":
      await db
        .collection("Product")
        .updateMany(
          { "Product.Category": { $eq: bodyObject.prevValue } },
          { $set: { "Product.Category": bodyObject.value } }
        );
      res.json(bodyObject.value);
      break;
    case "DELETE":
      const entriesToDelete = bodyObject.value.map((entry: any) => ({
        "Product.Category": { $eq: `${entry}` },
      }));
      await db.collection("Product").deleteMany({
        $or: entriesToDelete,
      });
      res.json({ status: 200, data: bodyObject.value });
      break;
    case "GET":
      const products = await db
        .collection("Product")
        .aggregate([
          {
            $group: {
              _id: "$Product.Category",
              document: { $push: { id: "$_id" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray();
      res.json({ status: 200, data: products });
      break;
  }
}
