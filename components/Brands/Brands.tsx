import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Column, Row } from "react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../Table";
import Image from "next/image";
import algoliasearch from "algoliasearch";
import Loader from "../Loader/Loader";

const Brands = ({ products }: any) => {
  const [updatedBrands, setUpdatedBrands] = useState(products);

  useEffect(() => {
    setData(
      updatedBrands.map((product: any) => ({
        name: product._id,
        amount: product.count,
      }))
    );
  }, [updatedBrands]);
  const [loading, setLoading] = React.useState(false);
  const pageCount = Math.ceil(updatedBrands / 20);

  const [data, setData] = useState([]);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedFlatRow[]>([]);
  const [schema, setSchema] = useState<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const client = algoliasearch(
    `${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`,
    `${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}`
  );
  const index = client.initIndex(`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX}`);

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    setIsLoading(true);
    let res: any = await fetch("/api/schema", {
      method: "GET",
    });
    res = await res.json();
    console.log(res);
    const obj = res.data[0]?.data;
    setSchema(obj);
    setIsLoading(false);
  };

  const columns: Array<Column<any>> = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        editable: true,
        id: "name",
      },
      {
        Header: "Amount of specifications",
        accessor: "amount",
        id: "amount",
      },
    ],
    []
  );

  interface SelectedFlatRow {
    name: String;
    amount: Number;
  }

  const resetData = () => {
    setData([]);
    setTimeout(() => {
      setData(data);
    }, 10);
  };

  const handleCancel = () => {
    setShowDeleteOption(false);
    setSelectedRows([]);
    resetData();
  };

  const fetchData = async () => {
    setIsLoading(true);
    let res: any = await fetch("/api/brands", {
      method: "GET",
    });
    res = await res.json();
    setUpdatedBrands(res.data);
    setIsLoading(false);
  };

  const updateData = async (prevValue: String, value: String) => {
    setIsLoading(true);
    let res = await fetch("/api/brands", {
      method: "PUT",
      body: JSON.stringify({
        value,
        prevValue,
      }),
    });
    toast(`Beand Updated`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    res = await res.json();
    setIsLoading(false);
  };

  const handleSearch = async (searchText: string) => {
    if (searchText === "") {
      fetchData();
      return;
    }
    setIsLoading(true);
    const results = await index.searchForFacetValues(
      "Product.Brand",
      searchText
    );
    if (results && results.facetHits) {
      const suggestedModels = results.facetHits.map((model: any) => {
        model._id = model.value;
        return model;
      });
      setUpdatedBrands([...suggestedModels]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (row: Row) => {
    setIsLoading(true);
    let res: any = await fetch("/api/brands", {
      method: "DELETE",
      body: JSON.stringify({
        value: [row.values.name],
      }),
    });
    res = await res.json();
    onDeletion(res.data);
    setIsLoading(false);
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    let res: any = await fetch("/api/brands", {
      method: "DELETE",
      body: JSON.stringify({
        value: selectedRows.map((row) => row.name),
      }),
    });
    res = await res.json();
    onDeletion(res.data);
    setIsLoading(false);
  };

  const onDeletion = (deletedItems: any[]) => {
    toast(`🗑️ ${deletedItems.map((item) => item).join(", ")} Deleted!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    fetchData();
  };

  const onRowSelection = (rows: SelectedFlatRow[]) => {
    rows.length > 0 ? setShowDeleteOption(true) : setShowDeleteOption(false);
    setSelectedRows(rows);
  };

  const deleteSelectedRows = () => {
    handleBulkDelete();
  };

  const createNew = async () => {
    delete schema.language;
    delete schema.type;
    delete schema.category;
    try {
      setLoading(true);
      let res: any = await fetch("/api/specs", {
        method: "POST",
        body: JSON.stringify({
          value: schema,
        }),
      });
      res = await res.json();
      setLoading(false);
      router.push(`/add?id=${res._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Loader showLoader={isLoading} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
      <div className="flex-1">
        <div className="flex justify-between text-white bg-dark-blue px-10 pt-10 pb-28">
          <h1 className="text-xl">
            {" "}
            {selectedRows.length > 0 && <>Delete</>} All{" "}
            {selectedRows.length > 0 && <>Products From</>} Brands
          </h1>
          {!showDeleteOption && (
            <button className="bg-cyan text-xs px-6 py-3" onClick={createNew}>
              CREATE NEW
            </button>
          )}
          {showDeleteOption && (
            <div>
              <button className="text-xs px-6 py-3" onClick={handleCancel}>
                CANCEL
              </button>
              <button
                className="bg-red-500 text-xs px-6 py-3"
                onClick={deleteSelectedRows}
              >
                DELETE
              </button>
            </div>
          )}
        </div>
        <div className="-my-15 mx-10 ">
          <div className="relative w-full">
            <div className="flex absolute top-3 right-5">
              <input
                type="text"
                className="border-0 outline-none text-med-blue bg-med-light-gray rounded-sm mr-2 p-2"
                onChange={(e: any) => handleSearch(e.target.value)}
              />
              <Image
                src={"/Search.svg"}
                alt="search icon"
                width={20}
                height={20}
              />
            </div>
            <Table
              columns={columns}
              data={data}
              loading={loading}
              updateData={updateData}
              handleDelete={handleDelete}
              onRowSelection={onRowSelection}
              resetData={resetData}
              editable={true}
              enableSelection={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Brands;
