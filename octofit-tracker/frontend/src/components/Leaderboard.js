import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaderboard data
        const leaderboardUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
        console.log('Fetching leaderboard from:', leaderboardUrl);
        const leaderboardResponse = await fetch(leaderboardUrl);
        if (!leaderboardResponse.ok) {
          throw new Error(`HTTP error! status: ${leaderboardResponse.status}`);
        }
        const leaderboardData = await leaderboardResponse.json();
        const leaderboardArray = leaderboardData.results || leaderboardData;
        
        // Fetch users data
        const usersUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
        console.log('Fetching users from:', usersUrl);
        const usersResponse = await fetch(usersUrl);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        const usersArray = usersData.results || usersData;
        
        // Create a lookup map of user_id to user name
        const usersMap = {};
        usersArray.forEach(user => {
          usersMap[user.id] = user.name;
        });
        
        console.log('Leaderboard data received:', leaderboardArray);
        console.log('Users map created:', usersMap);
        
        setLeaderboard(leaderboardArray);
        setUsers(usersMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-dark';
    if (rank === 2) return 'bg-secondary';
    if (rank === 3) return 'bg-secondary';
    return 'bg-light text-dark';
  };

  const getRankIcon = (rank) => {
    return '';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="mt-3">Loading leaderboard...</h3>
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
        <h1>Competitive Leaderboard</h1>
        <p className="lead mb-0">See where you rank among competitors</p>
      </div>

      <div className="mb-3">
        <h3>Top Performers: <span className="badge bg-secondary">{leaderboard.length}</span></h3>
      </div>

      {leaderboard.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>No leaderboard data available</h4>
          <p className="mb-0">Complete activities to start earning points and appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{width: '80px'}}>Rank</th>
                <th>Username</th>
                <th>Total Points</th>
                <th style={{width: '120px'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const username = users[entry.user_id] || entry.user_id;
                return (
                  <tr key={entry.id}>
                    <td>
                      <h4 className="mb-0">
                        <span className={`badge ${getRankBadge(rank)}`}>
                          {getRankIcon(rank)} #{rank}
                        </span>
                      </h4>
                    </td>
                    <td>
                      <strong>{username}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary" style={{fontSize: '1rem'}}>
                        {entry.total_points} pts
                      </span>
                    </td>
                    <td>
                      {rank <= 3 ? (
                        <span className="badge bg-dark">Top 3</span>
                      ) : rank <= 10 ? (
                        <span className="badge bg-secondary">Top 10</span>
                      ) : (
                        <span className="badge bg-light text-dark">Competing</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
