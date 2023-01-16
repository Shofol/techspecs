import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Brands from "../components/Brands/Brands";
import clientPromise from "../lib/mongodb";
import CategoriesComponent from "../components/Categories/Categories";
import CreateSpecification from "../components/Specifications/CreateSpecification";

export default function CreateSpec(props: any) {
  return (
    <>
      <Head>
        <Head>
          <title>Create New Specification</title>
          <meta name="description" content="TechSpecs" />
        </Head>
      </Head>
      <main className="min-h-screen flex flex-col justify-between bg-light-gray">
        <Navbar />
        <CreateSpecification />
        <Footer />
      </main>
    </>
  );
}

// export async function getServerSideProps() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("v4");

//     const products = await db
//       .collection("Product")
//       .aggregate([
//         {
//           $group: {
//             _id: "$Product.Category",
//             document: { $push: { id: "$_id" } },
//             count: { $sum: 1 },
//           },
//         },
//         { $sort: { _id: 1 } },
//       ])
//       .toArray();

//     return {
//       props: { products: JSON.parse(JSON.stringify(products)) },
//     };
//   } catch (e) {
//     console.error(e);
//   }
// }
