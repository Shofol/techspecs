// posts.js

import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("v4");
  let bodyObject = req.body ? JSON.parse(req.body) : {};
  // db.collection("Product").createIndex({ "Product.Brand": "text" });
  const id: any = req.query.id;

  switch (req.method) {
    // case "POST":
    //   await db.collection("Product").insertOne(bodyObject.value);
    //   res.json(bodyObject.value);
    //   break;
    case "PUT":
      await db
        .collection("Product")
        .replaceOne({ _id: new ObjectId(id) }, bodyObject.value);
      res.json(bodyObject.value);
      break;
    // case "DELETE":
    //   const entriesToDelete = bodyObject.value.map((entry: any) => ({
    //     "Product.Brand": { $eq: `${entry}` },
    //   }));
    //   await db.collection("Product").deleteMany({
    //     $or: entriesToDelete,
    //   });
    //   res.json({ status: 200, data: bodyObject.value });
    //   break;
    case "GET":
      //   const id: any = req.query.id;
      const products = await db
        .collection("Product")
        .findOne({ _id: new ObjectId(id) });
      // .toArray();
      res.json({ status: 200, data: products });
      break;
  }
}
