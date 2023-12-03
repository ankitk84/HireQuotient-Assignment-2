import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import Pagination from '@mui/material/Pagination';

const Admin_Dashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  // const [editingRow, setEditingRow] = useState(null);

  const handleSearch = () => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.role.toLowerCase().includes(search.toLowerCase())
    );
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectRow = (id) => {
    const index = selectedRows.indexOf(id);
    if (index > -1) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((rowId) => rowId !== id)
      );
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, id]);
    }
  };

  const handleSelectAllRows = () => {
    const allRowIds = handleSearch()
      .slice((page - 1) * 10, page * 10)
      .map((row) => row.id);

    const newSelectedRows =
      selectedRows.length === allRowIds.length ? [] : allRowIds;
    setSelectedRows(newSelectedRows);
  };



  const [editingRows, setEditingRows] = useState({});

  const handleEditRow = (id) => {
    setEditingRows((prevEditingRows) => ({
      ...prevEditingRows,
      [id]: true,
    }));
  };
  
  const handleCancelEditRow = (id) => {
    setEditingRows((prevEditingRows) => ({
      ...prevEditingRows,
      [id]: false,
    }));
  };
  
  const handleSaveRow = (id, newData) => {
    setEditingRows((prevEditingRows) => ({
      ...prevEditingRows,
      [id]: false,
    }));
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, ...newData } : item))
    );
  };
  // const handleEditRow = (id) => {
  //   setEditingRow(id);
  // };

  // const handleSaveRow = (id, newData) => {
  //   setEditingRow(null);
  //   setData((prevData) =>
  //     prevData.map((item) => (item.id === id ? { ...item, ...newData } : item))
  //   );
  // };

  const handleDeleteRows = () => {
    setData((prevData) =>
      prevData.filter((item) => !selectedRows.includes(item.id))
    );
    setSelectedRows([]);
  };

  return (
    <>
      <Search setSearch={setSearch} />
      {data ? (
        <table className="table w-75  mx-auto table-bordered" >
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  onChange={handleSelectAllRows}
                  checked={
                    selectedRows.length ===
                    handleSearch().slice((page - 1) * 10, page * 10).length
                  }
                />
              </th>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {handleSearch()
              .slice((page - 1) * 10, page * 10)
              .map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectRow(item.id)}
                      checked={selectedRows.includes(item.id)}
                    />
             
                  </td>
                  <th scope="row">{item.id}</th>
                  <td>
                    {/* {editingRow === item.id ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleSaveRow(item.id, { name: e.target.value })
                        }
                      />
                    ) : (
                      item.name
                    )} */}

                    {editingRows[item.id] ? (
                              <>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const { value } = e.target;
                                    setData((prevData) =>
                                      prevData.map((row) =>
                                        row.id === item.id ? { ...row, name: value } : row
                                      )
                                    );
                                  }}
                                />
                                <button onClick={() => handleSaveRow(item.id, item)}>Save</button>
                                <button onClick={() => handleCancelEditRow(item.id)}>Cancel</button>
                              </>
                            ) : (
                              <>
                                {item.name}
                              </>
                            )}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    {editingRows === item.id ? (
                      <button onClick={() => handleSaveRow(item.id, item)}>
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEditRow(item.id)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <h1>Loading...</h1>
      )}

      <div style={{display:'flex'}}>
      {selectedRows.length >= 0 && (
        <div   style={{   marginLeft:190 }}>
          <button onClick={handleDeleteRows}>Delete Selected</button>
          <p>{selectedRows.length} row(s) selected</p>
        </div>
      )}

      {data && (
        <Pagination 
          count={Math.ceil(handleSearch().length / 10)}
          page={page}
          onChange={(e, value) => setPage(value)}
          style={{  marginRight:"auto", marginLeft:700 }}
        />
      )}
      </div>
    </>
  );
};

export default Admin_Dashboard;