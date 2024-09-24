import React, { useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';

import '../../../node_modules/datatables.net-dt/css/dataTables.dataTables.min.css'; 
// import 'datatables.net';

const DataTable = () => {
  useEffect(() => {
    const initializeDataTable = (data) => {
      $('#dataTable').DataTable({
        data: data,
        columns: [
          { title: 'Question', data: 'question' },
          { title: 'Options', data: 'options' },
          { title: 'Answer', data: 'answer' },
          {
            title: 'Actions',
            data: null,
            defaultContent: `
              <button class="delete-btn">Delete</button>
            `,
            orderable: false
          }
        ],
        destroy: true,
        processing: true,
        serverSide: false
      });

      // Handle edit button clicks
    //   $('#dataTable').on('click', '.edit-btn', function() {
    //     const row = $(this).closest('tr');
    //     const rowData = $('#dataTable').DataTable().row(row).data();
    //     handleEdit(rowData);
    //   });

      $('#dataTable').on('click', '.delete-btn', function() {
        const row = $(this).closest('tr');
        const rowData = $('#dataTable').DataTable().row(row).data();
        handleDelete(rowData);
      });
    };

    axios.get('http://127.0.0.1:8000/api/get/data')
      .then(response => {
        console.log(response.data);
        initializeDataTable(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    return () => {
      if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy(true);
      }
    };
  }, []);

  // Handle the edit action
//   const handleEdit = (rowData) => {
//     // Implement your edit logic here
//     console.log('Edit data:', rowData);
//     // You might want to show a modal or navigate to an edit page
//   };

  const handleDelete = (rowData) => {
    console.log('Delete data:', rowData);
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      axios.delete(`http://127.0.0.1:8000/api/deleteData/${rowData.id}`)
        .then(response => {
          console.log('Delete successful:', response);
          $('#dataTable').DataTable().ajax.reload();
        })
        .catch(error => {
          console.error('Error deleting data:', error);
        });
    }
  };

  return (
    <div className="data-table-container" style={{border:'white solid 1px'}}>
      <table id="dataTable" className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Question</th>
            <th>Options</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
      <style jsx>{`
        .data-table-container {
          padding: 20px;
          background-color: black;
          border-radius: 8px;
          overflow-x: auto;
        }
        table.dataTable {
          border-collapse: collapse;
          width: 100%;
        }
        table.dataTable th,
        table.dataTable td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        table.dataTable th {
          background-color: black;
          color: white;
          font-weight: bold;
        }
        table.dataTable tbody tr:hover {
          background-color: #f1f1f1;
        }
        .edit-btn, .delete-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
        }
        .delete-btn {
          background-color: #f44336;
        }
        .edit-btn:hover {
          background-color: #45a049;
        }
        .delete-btn:hover {
          background-color: #e53935;
        }
      `}</style>
    </div>
  );
};

export default DataTable;
