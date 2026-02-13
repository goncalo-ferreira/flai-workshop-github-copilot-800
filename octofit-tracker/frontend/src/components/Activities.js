import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesArray = data.results || data;
        setActivities(activitiesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="mt-3">Loading activities...</h3>
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
        <h1>Fitness Activities</h1>
        <p className="lead mb-0">Track and monitor your workout activities</p>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Total Activities: <span className="badge bg-secondary">{activities.length}</span></h3>
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

      {activities.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>No activities found</h4>
          <p className="mb-0">Start logging your fitness activities to see them here!</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Activity Type</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>Calories</th>
                <th>Date</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <span className="badge bg-secondary">{activity.activity_type}</span>
                  </td>
                  <td>{activity.duration} min</td>
                  <td>
                    {activity.distance ? (
                      <span>{activity.distance} km</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>{activity.calories} cal</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-light text-dark">{activity.user_id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {activities.map((activity) => (
            <div key={activity.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <span className="badge bg-secondary">{activity.activity_type}</span>
                  </h5>
                  <hr />
                  <p className="card-text">
                    <strong>Duration:</strong> {activity.duration} minutes<br />
                    <strong>Distance:</strong> {activity.distance ? `${activity.distance} km` : 'N/A'}<br />
                    <strong>Calories:</strong> {activity.calories} cal<br />
                    <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}<br />
                    <strong>User ID:</strong> <span className="badge bg-light text-dark">{activity.user_id}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activities;
