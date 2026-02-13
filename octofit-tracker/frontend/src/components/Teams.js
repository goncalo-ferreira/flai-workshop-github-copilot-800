import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsArray = data.results || data;
        setTeams(teamsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="mt-3">Loading teams...</h3>
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
        <h1>Team Management</h1>
        <p className="lead mb-0">Create and manage your fitness teams</p>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Active Teams: <span className="badge bg-secondary">{teams.length}</span></h3>
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

      {teams.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>No teams found</h4>
          <p className="mb-0">Create a team to start competing with others!</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Description</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>
                    <strong>{team.name}</strong>
                  </td>
                  <td>{team.description || 'No description'}</td>
                  <td>{new Date(team.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2">View</button>
                    <button className="btn btn-sm btn-success">Join</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team.id} className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <hr />
                  <p className="card-text">
                    <strong>Description:</strong><br />
                    {team.description || 'No description'}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created: {new Date(team.created_at).toLocaleDateString()}
                    </small>
                  </p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-info">View Team</button>
                    <button className="btn btn-success">Join Team</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
