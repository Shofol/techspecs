import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreateSpecification from "../components/Specifications/CreateSpecification";

export default function Schema(props: any) {
  return (
    <>
      <Head>
        <Head>
          <title>Schema Manager</title>
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
