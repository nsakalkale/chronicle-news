import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../images/logo.png";
import { ClipLoader } from "react-spinners";

const INITIAL_PAGE_SIZE = 8;
const COUNTRIES = [
  { code: "ae", name: "United Arab Emirates" },
  { code: "ar", name: "Argentina" },
  { code: "at", name: "Austria" },
  { code: "au", name: "Australia" },
  { code: "be", name: "Belgium" },
  { code: "bg", name: "Bulgaria" },
  { code: "br", name: "Brazil" },
  { code: "ca", name: "Canada" },
  { code: "ch", name: "Switzerland" },
  { code: "cn", name: "China" },
  { code: "co", name: "Colombia" },
  { code: "cu", name: "Cuba" },
  { code: "cz", name: "Czech Republic" },
  { code: "de", name: "Germany" },
  { code: "eg", name: "Egypt" },
  { code: "fr", name: "France" },
  { code: "gb", name: "United Kingdom" },
  { code: "gr", name: "Greece" },
  { code: "hk", name: "Hong Kong" },
  { code: "hu", name: "Hungary" },
  { code: "id", name: "Indonesia" },
  { code: "ie", name: "Ireland" },
  { code: "il", name: "Israel" },
  { code: "in", name: "India" },
  { code: "it", name: "Italy" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "lt", name: "Lithuania" },
  { code: "lv", name: "Latvia" },
  { code: "ma", name: "Morocco" },
  { code: "mx", name: "Mexico" },
  { code: "my", name: "Malaysia" },
  { code: "ng", name: "Nigeria" },
  { code: "nl", name: "Netherlands" },
  { code: "nz", name: "New Zealand" },
  { code: "ph", name: "Philippines" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "ro", name: "Romania" },
  { code: "rs", name: "Serbia" },
  { code: "ru", name: "Russia" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "se", name: "Sweden" },
  { code: "sg", name: "Singapore" },
  { code: "si", name: "Slovenia" },
  { code: "sk", name: "Slovakia" },
  { code: "th", name: "Thailand" },
  { code: "tr", name: "Turkey" },
  { code: "tw", name: "Taiwan" },
  { code: "ua", name: "Ukraine" },
  { code: "us", name: "United States" },
  { code: "ve", name: "Venezuela" },
  { code: "za", name: "South Africa" },
];

export default function TopHeadlines() {
  const [allArticles, setAllArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [country, setCountry] = useState("in");
  const loadingBarRef = useRef(null);

  const fetchAllArticles = async (selectedCountry) => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NEWS_URL}api/top-headlines?country=${selectedCountry}`
      );
      console.log("API Response:", response.data); // Log the entire response
      if (response.data && response.data.articles) {
        const filteredArticles = response.data.articles.filter(
          (article) =>
            article.source.name !== "[Removed]" &&
            article.content !== "[Removed]" &&
            article.urlToImage !== "[Removed]" &&
            article.title !== "[Removed]" &&
            article.urlToImage &&
            article.content
        );
        setAllArticles(filteredArticles);
        setDisplayedArticles(filteredArticles.slice(0, INITIAL_PAGE_SIZE));
        setHasMore(filteredArticles.length > INITIAL_PAGE_SIZE);
      } else {
        setAllArticles([]);
        setDisplayedArticles([]);
        setHasMore(false);
      }
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
    fetchAllArticles(country);
  }, [country]);

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
        const newEndIndex = (page + 1) * INITIAL_PAGE_SIZE;
        const newArticles = allArticles.slice(0, newEndIndex);
        setDisplayedArticles(newArticles);
        setLoadingMore(false);
        setHasMore(newArticles.length < allArticles.length);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allArticles, page, hasMore, loadingMore]);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    setPage(1);
    setAllArticles([]);
    setDisplayedArticles([]);
    setLoading(true);
  };

  return (
    <>
      <div className="container">
        <br />
        <text className="fw-bold display-5">TOP HEADLINES</text>
        <hr />
        <div className="my-4">
          <select
            className="form-select"
            value={country}
            onChange={handleCountryChange}
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
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
                          className="rounded"
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
