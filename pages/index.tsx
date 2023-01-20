import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Home(props: any) {
  return (
    <>
      <Head>
        <title>TechSpecs</title>
        <meta name="description" content="TechSpecs" />
      </Head>
      <main className="min-h-screen flex flex-col justify-between bg-light-gray">
        <Navbar />
        <div className="bg-dark-blue flex justify-center py-10 max-w-lg mx-auto px-10">
          <Image src="/logo.svg" width={200} height={200} alt="logo" />
        </div>
        <Footer />
      </main>
    </>
  );
}
