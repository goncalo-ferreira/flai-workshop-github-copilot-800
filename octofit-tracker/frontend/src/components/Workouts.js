import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsArray = data.results || data;
        setWorkouts(workoutsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-light text-dark';
      case 'intermediate':
        return 'bg-secondary';
      case 'advanced':
        return 'bg-dark';
      default:
        return 'bg-light text-dark';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="mt-3">Loading workouts...</h3>
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
        <h1>Personalized Workouts</h1>
        <p className="lead mb-0">Browse workout suggestions tailored to your fitness goals</p>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Available Workouts: <span className="badge bg-secondary">{workouts.length}</span></h3>
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

      {workouts.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>No workouts available</h4>
          <p className="mb-0">Check back later for personalized workout suggestions!</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Workout Title</th>
                <th>Exercise Type</th>
                <th>Duration</th>
                <th>Difficulty</th>
                <th>Calories</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td>
                    <strong>{workout.title}</strong>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{workout.exercise_type}</span>
                  </td>
                  <td>{workout.duration} min</td>
                  <td>
                    <span className={`badge ${getDifficultyBadge(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </td>
                  <td>{workout.calories_estimate} cal</td>
                  <td>{workout.description}</td>
                  <td>
                    <button className="btn btn-sm btn-success">Start</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {workouts.map((workout) => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{workout.title}</h5>
                    <span className={`badge ${getDifficultyBadge(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="badge bg-secondary">{workout.exercise_type}</span>
                  </div>
                  <hr />
                  <p className="card-text">
                    <strong>Description:</strong><br />
                    {workout.description}
                  </p>
                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="border rounded p-2">
                        <small className="text-muted">Duration</small>
                        <h6 className="mb-0">{workout.duration} min</h6>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-2">
                        <small className="text-muted">Calories</small>
                        <h6 className="mb-0">{workout.calories_estimate}</h6>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-success w-100">Start Workout</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
