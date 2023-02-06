import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Brands from "../components/Brands/Brands";
import clientPromise from "../lib/mongodb";
import CategoriesComponent from "../components/Categories/Categories";

export default function Categories(props: any) {
  return (
    <>
      <Head>
        <Head>
          <title>TechSpecs Categories</title>
          <meta name="description" content="TechSpecs" />
        </Head>
      </Head>
      <main className="min-h-screen flex flex-col justify-between bg-light-gray">
        <Navbar />
        <CategoriesComponent products={props.products} />
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("v4");

    const products = await db
      .collection("products")
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

    return {
      props: { products: JSON.parse(JSON.stringify(products)) },
    };
  } catch (e) {
    console.error(e);
  }
}
