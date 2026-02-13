import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
        console.log('Fetching users from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersArray = data.results || data;
        setUsers(usersArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="mt-3">Loading users...</h3>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header text-center">
        <h1>User Profiles</h1>
        <p className="lead mb-0">Manage and view user accounts</p>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Registered Users: <span className="badge bg-secondary">{users.length}</span></h3>
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn btn-${viewMode === 'table' ? 'primary' : 'secondary'}`}
            onClick={() => setViewMode('table')}
          >
            <i className="bi bi-table"></i> Table View
          </button>
          <button 
            type="button" 
            className={`btn btn-${viewMode === 'cards' ? 'primary' : 'secondary'}`}
            onClick={() => setViewMode('cards')}
          >
            <i className="bi bi-grid-3x3-gap"></i> Card View
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>No users found</h4>
          <p className="mb-0">No registered users in the system yet.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Team ID</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.team_id ? (
                      <span className="badge bg-dark">{user.team_id}</span>
                    ) : (
                      <span className="badge bg-light text-dark">No Team</span>
                    )}
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-info">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {users.map((user) => (
            <div key={user.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <hr />
                  <p className="card-text">
                    <strong>Email:</strong> {user.email}<br />
                    <strong>Team ID:</strong> {user.team_id ? (
                      <span className="badge bg-dark">{user.team_id}</span>
                    ) : (
                      <span className="badge bg-light text-dark">No Team</span>
                    )}<br />
                    <strong>Date Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <button className="btn btn-info w-100">View Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
