export const fetchPopularMovies = async () => {
  try {
    const response = await fetch("http://localhost:5000/landing/movies/popular");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return []; // Return an empty array on failure
  }
};

export const fetchTopRatedMovies = async () => {
  try {
    const response = await fetch("http://localhost:5000/landing/movies/top_rated");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch top-rated movies:", error);
    return []; // Return an empty array on failure
  }
};

export const fetchUpCoMovies = async () => {
  try {
    const response = await fetch("http://localhost:5000/landing/movies/upcoming");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return []; // Return an empty array on failure
  }
};

export const fetchTopMovies = async () => {
  try {
    const response = await fetch("http://localhost:5000/landing/movies/top_movie");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch top-rated movies:", error);
    return []; // Return an empty array on failure
  }
};

export const fetchMovieDetail = async (id) => {
  try {
      const response = await fetch(`http://localhost:5000/landing/movies/${id}`);
      if (!response.ok) {
          throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      return data; // Hanya kembalikan data
  } catch (err) {
      console.error('Error fetching movie:', err);
      throw err; // Lempar error agar bisa ditangani di komponen
  }
};


