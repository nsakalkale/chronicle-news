import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../images/logo.png";
import { ClipLoader } from "react-spinners";

const INITIAL_PAGE_SIZE = 8;

export default function Dashboard() {
  const [allArticles, setAllArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState("Apple");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingBarRef = useRef(null);

  const fetchAllArticles = async (searchQuery) => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NEWS_URL}api/search?q=${searchQuery}`
      );

      const articles = response.data?.articles || [];
      const filteredArticles = articles.filter(
        (article) =>
          article.source?.name !== "[Removed]" &&
          article.content !== "[Removed]" &&
          article.urlToImage !== "[Removed]" &&
          article.title !== "[Removed]"
      );

      setAllArticles(filteredArticles);
      setDisplayedArticles(filteredArticles.slice(0, INITIAL_PAGE_SIZE));
      setHasMore(filteredArticles.length > INITIAL_PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching the articles: ", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  };

  useEffect(() => {
    fetchAllArticles(query);
  }, [query]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.scrollHeight &&
        hasMore &&
        !loadingMore
      ) {
        setLoadingMore(true);
        setPage((prevPage) => prevPage + 1);
        const newEndIndex = page * INITIAL_PAGE_SIZE;
        const newArticles = allArticles.slice(0, newEndIndex);
        setDisplayedArticles(newArticles);
        setLoadingMore(false);
        setHasMore(newArticles.length < allArticles.length);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allArticles, page, hasMore, loadingMore]);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = event.target.search.value;
    setQuery(searchQuery);
    setPage(1);
    setAllArticles([]);
    setDisplayedArticles([]);
    setLoading(true);
  };

  return (
    <>
      <div className="container">
        <br />
        <div className="fw-bold display-5 text-center">KNOW THE WORLD</div>

        <form onSubmit={handleSearch} className="my-4">
          <div className="d-flex justify-content-between align-items-center">
            <input
              type="text"
              name="search"
              className="search-box"
              placeholder="Search"
              autoComplete="off"
            />
            <button className="news-btn" type="submit">
              Search
            </button>
          </div>
        </form>
        {loading && !displayedArticles.length ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <ClipLoader color="#00231" size={50} />
          </div>
        ) : (
          <>
            <div className="row">
              {displayedArticles.map((article, index) => (
                <div className="col-md-3 mt-3" key={index}>
                  <Link className="news-link" to={article.url} target="_blank">
                    <div className="news-container">
                      <div className="news-image">
                        <img
                          src={article.urlToImage || logo}
                          width="100%"
                          height="150px"
                          alt="news"
                        />
                      </div>
                      <hr />
                      <div className="news-content">
                        <div className="fw-bold">
                          <p>
                            <span className="text-lightblue news-title">
                              {article.title}
                            </span>
                            <br />
                            <small className="" style={{ fontSize: "70%" }}>
                              {article.author || "Unknown Author"}
                            </small>
                          </p>
                        </div>
                        <div className="text-grey news-des">
                          {article.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {loadingMore && (
              <div
                className="d-flex justify-content-center align-items-center mt-3"
                style={{ height: "50px" }}
              >
                <ClipLoader color="#00231" size={30} />
              </div>
            )}
          </>
        )}
      </div>
      <br />
    </>
  );
}
