import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Brands from "../components/Brands/Brands";
import clientPromise from "../lib/mongodb";
import CategoriesComponent from "../components/Categories/Categories";
import Specifications from "../components/Specifications/Specifications";

export default function Specs(props: any) {
  return (
    <>
      <Head>
        <Head>
          <title>TechSpecs Specifications</title>
          <meta name="description" content="TechSpecs" />
        </Head>
      </Head>
      <main className="min-h-screen flex flex-col justify-between bg-light-gray">
        <Navbar />
        <Specifications
          products={props.products}
          totalSpecs={props.totalSpecs}
        />
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
      .collection("Product")
      .find({})
      .sort({ "Product.Brand": 1 })
      .limit(10)
      .toArray();
    const count = await db.collection("Product").countDocuments({});
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        totalSpecs: count,
      },
    };
  } catch (e) {
    console.error(e);
  }
}
