import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const clientID = `?client_id=${process.env.REACT_APP_PHOTO_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

const scrollPadding = 100;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchImages = async () => {
    setLoading(true);

    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${searchTerm}`;

    if (searchTerm) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos((existPhotos) => {
        if (searchTerm && page === 1) {
          return data.results;
        }

        if (searchTerm) {
          return [...existPhotos, ...data.results];
        }

        return [...existPhotos, ...data];
      });
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      const height = parseInt(window.innerHeight + window.scrollY);

      if ((!loading && height) >= document.body.scrollHeight - scrollPadding) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return window.removeEventListener("scroll", event);
    // eslint-disable-next-line
  }, []);

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo) => {
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
