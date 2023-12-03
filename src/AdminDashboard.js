
// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import Search from './Search';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import Pagination from '@mui/material/Pagination';

// const Admin_Dashboard = () => {

//     const [data, setData] = useState([]);
//     const [page, setPage] = useState(1);
//     const [search, setSearch] = useState("");

//     const handleSearch = () => {
//         return data.filter(
//             (data) =>
//                 data.name.toLowerCase().includes(search.toLowerCase()) ||
//                 data.email.toLowerCase().includes(search.toLowerCase()) ||
//                 data.role.toLowerCase().includes(search.toLowerCase())
//         );
//     };

//     const url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'

//     useEffect(() => {
//         axios.get(url).then((response) => {

//             setData(response.data)
//             console.log(data, 'data');
//         }
//         ).catch((error) => {
//             console.log(error)
//         })
//         //eslint-disable-next-line
//     }, [])
//     if (!data) return null

//     return (
//         <>
//             <Search setSearch={setSearch} />
//             {data ? (
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th scope="col">#</th>
//                             <th scope="col">Name</th>
//                             <th scope="col">Email</th>
//                             <th scope="col">Role</th>
//                             <th scope="col">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((item) => {
//                             return (
//                                 <tr key={item.id}>
//                                     <th scope="row">{item.id}</th>
//                                     <td>{item.name}</td>
//                                     <td>{item.email}</td>
//                                     <td>{item.role}</td>
//                                 </tr>
//                             );
//                         }
//                         )}

//                     </tbody>
//                 </table>
//             ) : (<h1>Loading...</h1>)

//             }

//             {data && (
//                 <Pagination
//                     count={Math.ceil(handleSearch().length / 10)}
//                     page={page}
//                     onChange={(e, value) => setPage(value)}
//                     style={{ marginTop: "2rem" }}
//                 />
//             )}
//         </>
//     )
// }

// export default Admin_Dashboard




// {/* {data.length ? ( // Check if 'data' is not empty
//         data.slice(0,10).map((item) => (
//           <div key={item.id}>
//             <h1>{item.name}</h1>
//             <p>{item.email}</p>
//             <p>{item.role}</p>
//           </div>
//         ))
//       ) : (
//         <h1>Loading...</h1>
//       )} */}

// {/* <div>{ data[1].id} </div> */ }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';

import Pagination from '@mui/material/Pagination';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

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

  const handleEditRow = (id) => {
    setEditingRow(id);
  };

  const handleSaveRow = (id, newData) => {
    setEditingRow(null);
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, ...newData } : item))
    );
  };

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
        <table className="table">
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
                    {editingRow === item.id ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleSaveRow(item.id, { name: e.target.value })
                        }
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    {editingRow === item.id ? (
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

      {selectedRows.length > 0 && (
        <div>
          <button onClick={handleDeleteRows}>Delete Selected</button>
          <p>{selectedRows.length} row(s) selected</p>
        </div>
      )}

      {data && (
        <Pagination
          count={Math.ceil(handleSearch().length / 10)}
          page={page}
          onChange={(e, value) => setPage(value)}
          style={{ marginTop: '2rem' }}
        />
      )}
    </>
  );
};

export default AdminDashboard;
