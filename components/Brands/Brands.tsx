import { useRouter } from "next/router";
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
import Table from "../Table";

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
  //   let brands =
  //   const totalCount = updatedBrands.length;
  const [loading, setLoading] = React.useState(false);
  const pageCount = Math.ceil(updatedBrands / 20);

  const [data, setData] = useState([]);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedFlatRow[]>([]);
  const [schema, setSchema] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    let res: any = await fetch("/api/schema", {
      method: "GET",
    });
    res = await res.json();
    const obj = res.data[0].data;
    setSchema(obj);
  };

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

  const handleCancel = () => {
    setShowDeleteOption(false);
    setSelectedRows([]);
    resetData();
  };

  const fetchData = async () => {
    let res: any = await fetch("/api/brands", {
      method: "GET",
    });
    res = await res.json();
    setUpdatedBrands(res.data);
  };

  const updateData = async (prevValue: String, value: String) => {
    let res = await fetch("/api/brands", {
      method: "PUT",
      body: JSON.stringify({
        value,
        prevValue,
      }),
    });
    res = await res.json();
  };

  const handleDelete = async (row: Row) => {
    let res: any = await fetch("/api/brands", {
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
      // router.query = { id: res._id };
      router.push(`/createSpec?id=${res._id}`);
    } catch (error) {
      console.log(error);
    }
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
        <div className="-my-15 mx-10">
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
    </>
  );
};

export default Brands;
