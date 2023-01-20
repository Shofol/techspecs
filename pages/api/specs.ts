// posts.js

import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: any, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("v4");
  let bodyObject = req.body ? JSON.parse(req.body) : {};
  // db.collection("Product").createIndex({ "Product.Brand": "text" });

  switch (req.method) {
    case "POST":
      await db.collection("Product").insertOne(bodyObject.value);
      res.json(bodyObject.value);
      break;
    // case "PUT":
    //   await db
    //     .collection("Product")
    //     .updateMany(
    //       { "Product.Brand": { $eq: bodyObject.prevValue } },
    //       { $set: { "Product.Brand": bodyObject.value } }
    //     );
    //   res.json(bodyObject.value);
    //   break;
    case "DELETE":
      try {
        db.collection("Product").deleteOne({ _id: new ObjectId(req.query.id) });
      } catch (e) {
        console.log(e);
      }
      res.json({ status: 200 });
      break;
    case "GET":
      const pageIndex: any = req.query.pageIndex;
      const products = await db
        .collection("Product")
        .find({})
        .sort({ "Product.Brand": 1 })
        .skip(+pageIndex * 20)
        .limit(20)
        .toArray();
      res.json({ status: 200, data: products });
      break;
  }
}
