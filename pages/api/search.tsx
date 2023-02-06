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
  //   db.collection("products").createIndex({
  //     "Product.Brand": "text",
  //     "Product.Model": "text",
  //     "Product.Version": "text",
  //     "Product.Category": "text",
  //   });

  switch (req.method) {
    // case "PUT":
    //   await db
    //     .collection("products")
    //     .updateMany(
    //       { "Product.Brand": { $eq: bodyObject.prevValue } },
    //       { $set: { "Product.Brand": bodyObject.value } }
    //     );
    //   res.json(bodyObject.value);
    //   break;
    // case "DELETE":
    //   const entriesToDelete = bodyObject.value.map((entry: any) => ({
    //     "Product.Brand": { $eq: `${entry}` },
    //   }));
    //   await db.collection("products").deleteMany({
    //     $or: entriesToDelete,
    //   });
    //   res.json({ status: 200, data: bodyObject.value });
    //   break;
    case "GET":
      const searchText: any = req.query.searchText;
      const pageIndex: any = req.query.pageIndex;
      const products = await db
        .collection("products")
        .find({ $text: { $search: `'${searchText}'` } })
        .skip(+pageIndex * 20)
        .limit(20)
        .toArray();

      const count = await db
        .collection("products")
        .count({ $text: { $search: `'${searchText}'` } });
      res.json({
        status: 200,
        data: { products, count, pageIndex: pageIndex },
      });
      break;
  }
}
