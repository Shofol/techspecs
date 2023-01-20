import React, { useEffect, useState } from "react";
import { Column, Row } from "react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../Table";
import algoliasearch from "algoliasearch";
import Image from "next/image";
import Loader from "../Loader/Loader";

const CategoriesComponent = ({ products }: any) => {
  const [updatedBrands, setUpdatedBrands] = useState(products);

  useEffect(() => {
    setData(
      updatedBrands.map((product: any) => ({
        name: product._id,
        amount: product.count,
      }))
    );
  }, [updatedBrands]);
  //   let brands =
  //   const totalCount = updatedBrands.length;
  const [loading, setLoading] = React.useState(false);
  const pageCount = Math.ceil(updatedBrands / 20);

  const [data, setData] = useState([]);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedFlatRow[]>([]);
  const client = algoliasearch(
    `${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`,
    `${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}`
  );
  const index = client.initIndex(`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX}`);
  const [isLoading, setIsLoading] = useState(false);

  const columns: Array<Column<any>> = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        editable: true,
      },
      {
        Header: "Amount of specifications",
        accessor: "amount",
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

  const fetchData = async () => {
    setIsLoading(true);
    let res: any = await fetch("/api/categories", {
      method: "GET",
    });
    res = await res.json();
    setUpdatedBrands(res.data);
    setIsLoading(false);
  };

  const updateData = async (prevValue: String, value: String) => {
    setIsLoading(true);
    let res = await fetch("/api/categories", {
      method: "PUT",
      body: JSON.stringify({
        value,
        prevValue,
      }),
    });
    res = await res.json();
    setIsLoading(false);
  };

  const handleDelete = async (row: Row) => {
    setIsLoading(true);
    let res: any = await fetch("/api/categories", {
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
    let res: any = await fetch("/api/categories", {
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
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const onRowSelection = (rows: SelectedFlatRow[]) => {
    rows.length > 0 ? setShowDeleteOption(true) : setShowDeleteOption(false);
    setSelectedRows(rows);
  };

  const deleteSelectedRows = () => {
    handleBulkDelete();
  };

  const handleCancel = () => {
    setShowDeleteOption(false);
    setSelectedRows([]);
    resetData();
  };

  const handleSearch = async (searchText: string) => {
    if (searchText === "") {
      fetchData();
      return;
    }
    setIsLoading(true);
    const results = await index.searchForFacetValues(
      "Product.Category",
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
            {selectedRows.length > 0 && <>Delete</>} All{" "}
            {selectedRows.length > 0 && <>Products From</>} Categories
          </h1>
          {!showDeleteOption && (
            <button className="bg-cyan text-xs px-6 py-3">CREATE NEW</button>
          )}
          {showDeleteOption && (
            <div>
              <button
                className="ext-xs px-6 py-3 text-xs"
                onClick={handleCancel}
              >
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
        <div className="-my-15 mx-10">
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

export default CategoriesComponent;
