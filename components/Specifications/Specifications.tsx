import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  Column,
  TableInstance,
  Row,
} from "react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import clientPromise from "../../lib/mongodb";
import { Specification } from "../../types/specs";
import Table from "../Table";

const Specifications = ({ products, totalSpecs }: any) => {
  const [updatedBrands, setUpdatedBrands] = useState(products);

  useEffect(() => {
    setData(
      updatedBrands.map((entry: Specification) => ({
        image: entry.Product["Image URL"],
        brand: entry.Product.Brand,
        model: entry.Product.Model,
        version: entry.Product.Version,
        category: entry.Product.Category,
        released: entry.Date.Released,
      }))
    );
  }, [updatedBrands]);

  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = useState(Math.ceil(totalSpecs / 20));

  const [data, setData] = useState([]);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedFlatRow[]>([]);
  const [searchText, setSearchedText] = useState<String>("");

  const columns: Array<Column<any>> = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: (tableProps) => (
          <div>
            <Image
              className="w-10"
              src={tableProps.row.original.image}
              alt={tableProps.row.original.model}
              width={100}
              height={100}
            />
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Model",
        accessor: "model",
      },
      {
        Header: "Version",
        accessor: "version",
        disableSortBy: true,
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Released",
        accessor: "released",
      },
      {
        Header: () => (
          <div className="flex">
            <input
              type="text"
              className="border-0 outline-none text-med-blue bg-med-light-gray rounded-sm mr-2 p-2"
              // onBlur={(e) => handleSearch(e.target.value, 0)}
              onKeyUp={(e: any) => handleSearch(e.target.value, 0)}
            />
            <Image
              src={"/Search.svg"}
              alt="search icon"
              width={20}
              height={20}
            />
          </div>
        ),
        accessor: "search",
        disableSortBy: true,
      },
    ],
    []
  );

  interface SelectedFlatRow {
    name: String;
    amount: Number;
  }

  const handleSearch = async (searchText: String, pageIndex: Number) => {
    let res: any = await fetch(
      `/api/search?searchText=${searchText}&pageIndex=${pageIndex}`,
      {
        method: "GET",
      }
    );
    res = await res.json();
    setUpdatedBrands(res.data.products);
    setPageCount(Math.ceil(+res.data.count / 20));
    setSearchedText(searchText);
  };

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

  const fetchData = async (pageIndex: Number) => {
    if (searchText !== "") {
      handleSearch(searchText, pageIndex);
      return;
    }

    let res: any = await fetch(`/api/specs?pageIndex=${pageIndex}`, {
      method: "GET",
    });
    res = await res.json();
    setUpdatedBrands(res.data);
  };

  const updateData = async (prevValue: String, value: String) => {
    let res = await fetch("/api/specs", {
      method: "PUT",
      body: JSON.stringify({
        value,
        prevValue,
      }),
    });
    res = await res.json();
  };

  const handleDelete = async (row: Row) => {
    let res: any = await fetch("/api/specs", {
      method: "DELETE",
      body: JSON.stringify({
        value: [row.values.name],
      }),
    });
    res = await res.json();
    onDeletion(res.data);
  };

  const handleBulkDelete = async () => {
    let res: any = await fetch("/api/brands", {
      method: "DELETE",
      body: JSON.stringify({
        value: selectedRows.map((row) => row.name),
      }),
    });
    res = await res.json();
    onDeletion(res.data);
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
    fetchData(0);
  };

  const onRowSelection = (rows: SelectedFlatRow[]) => {
    rows.length > 0 ? setShowDeleteOption(true) : setShowDeleteOption(false);
    setSelectedRows(rows);
  };

  const deleteSelectedRows = () => {
    handleBulkDelete();
  };

  return (
    <>
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
          <h1 className="text-xl">All Brands</h1>
          {!showDeleteOption && (
            <button className="bg-cyan text-xs px-6 py-3">CREATE NEW</button>
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
        <div className="-my-15 mx-10">
          <Table
            columns={columns}
            data={data}
            loading={loading}
            updateData={updateData}
            handleDelete={handleDelete}
            onRowSelection={onRowSelection}
            resetData={resetData}
            editable={false}
            pageCount={pageCount}
            manualPagination={true}
            fetchData={fetchData}
            enableSelection={false}
          />
        </div>
      </div>
    </>
  );
};

export default Specifications;
