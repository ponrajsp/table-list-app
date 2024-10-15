import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RenderTableContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPeoples = async () => {
    try {
      const response = await axios.get('https://swapi.dev/api/people');
      const peoples = response.data.results;

      const peoplesWithData = await Promise.all(
        peoples.map(async (people) => {
          const films = await Promise.all(
            people.films.map(async (item) => {
              const filmResponse = await axios.get(item);
              return filmResponse.data.title;
            })
          );
          const vehicles = await Promise.all(
            people.vehicles.map(async (item) => {
              const vehicleResponse = await axios.get(item);
              return vehicleResponse.data.name;
            })
          );
          return { ...people, films, vehicles };
        })
      );

      setData(peoplesWithData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeoples();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Film Name</th>
            <th>Vehicle</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((people) => (
            <tr key={people.name}>
              <td>{people.name}</td>
              <td>{people.films.join(', ')}</td> 
              <td>{people.vehicles.join(', ') || 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenderTableContent;
