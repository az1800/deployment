// export default AccountingFirms;
import React, { useState, useEffect } from "react";
import axios from "axios";
import strings from "../../../Languages/localization"; // Import the localization strings
import LanguageSwitcher from "../LanguageSwitcher"; // Import the language switcher
import {
  Search,
  Star,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// Modified to accept onViewDetails as a prop instead of using useNavigate
const AccountingFirms = ({ onViewDetails }) => {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // For temporary search input
  const [activeSearch, setActiveSearch] = useState(""); // For active search query
  const [isRTL, setIsRTL] = useState(false);
  const [language, setLanguage] = useState("en");

  // Update search handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Only update temporary search term
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm); // Update active search only when form is submitted

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/accounting-firms?search=${searchTerm}`
      );
      setFirms(response.data.data);
    } catch (error) {
      console.error("Error searching firms:", error);
    }
  };

  // Initialize language on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    setLanguage(storedLanguage);
    strings.setLanguage(storedLanguage);
    setIsRTL(storedLanguage === "ar");

    // Check HTML document direction and update if needed
    if (storedLanguage === "ar" && document.documentElement.dir !== "rtl") {
      document.documentElement.dir = "rtl";
    } else if (
      storedLanguage !== "ar" &&
      document.documentElement.dir !== "ltr"
    ) {
      document.documentElement.dir = "ltr";
    }
  }, []);

  // Add a debugger function to help troubleshoot
  const debugLanguageState = () => {
    console.log({
      currentLanguage: strings.getLanguage(),
      localStorageLanguage: localStorage.getItem("language"),
      isRTL: isRTL,
      documentDir: document.documentElement.dir,
    });
  };

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem("language") || "en";

      // Only update if language actually changed
      if (newLanguage !== language) {
        setLanguage(newLanguage);
        strings.setLanguage(newLanguage);
        const newIsRTL = newLanguage === "ar";
        setIsRTL(newIsRTL);

        // Force RTL/LTR at document level
        document.documentElement.dir = newIsRTL ? "rtl" : "ltr";

        // Debug to console
        debugLanguageState();
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, [language]);

  // Fetch data
  useEffect(() => {
    fetchFirms();
  }, []);

  const fetchFirms = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/accounting-firms`
      );
      setFirms(response.data.data);
    } catch (error) {
      console.error("Error fetching firms:", error);
      // Use sample data if API fails
      setFirms(sampleAccountingFirms);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (firmId, newStatus) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/admin/accounting-firms/${firmId}/status`,
        {
          status: newStatus,
        }
      );
      fetchFirms(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredFirms = firms.filter((firm) => {
    const matchesFilter = filter === "all" || firm.status === filter;
    const matchesSearch = activeSearch
      ? firm.firmName?.toLowerCase().includes(activeSearch.toLowerCase()) ||
        firm.industrySpecialization
          ?.toLowerCase()
          .includes(activeSearch.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  // Function to render stars based on rating
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return stars;
  };

  // Function to get status badge color
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return (
          <CheckCircle
            className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"} text-green-600`}
          />
        );
      case "pending":
        return (
          <Clock
            className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"} text-yellow-600`}
          />
        );
      case "rejected":
        return (
          <XCircle
            className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"} text-red-600`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      className={`flex-1 overflow-y-auto h-full
        ${isRTL ? "text-right" : "text-left"}
        `}
      dir={isRTL ? "rtl" : "ltr"}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="mx-auto max-w-4xl p-4 md:p-8 lg:p-10">
        {/* Language Switcher */}
        {/* <LanguageSwitcher /> */}

        <div className="mb-4">
          <span className="mb-2 inline-block rounded-full bg-apple-blueMedium px-3 py-1 text-xs font-medium text-apple-text">
            {strings.dashboard.adminDashboard}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {strings.accountingFirms.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {strings.accountingFirms.overview}
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full">
          <form className="lg:block mb-8" onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                className={`w-full py-3 px-2 ${
                  isRTL ? "pr-10" : "pl-10"
                } rounded-full border text-sm text-black`}
                placeholder={strings.search.placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ textAlign: isRTL ? "right" : "left" }}
              />
              <div
                className={`absolute inset-y-0 ${
                  isRTL ? "right-0" : "left-0"
                } flex items-center ${
                  isRTL ? "pr-3" : "pl-3"
                } pointer-events-none`}
              ></div>
              <button
                className={`absolute top-1.5 ${
                  isRTL ? "left-3" : "right-3"
                } flex items-center rounded-full bg-[rgba(91,184,255,1)] py-2.5 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:bg-blue-600 focus:bg-blue-700`}
                type="submit"
              >
                <Search
                  className={`${isRTL ? "ml-2" : "mr-2"} w-4 h-4 text-white`}
                />
                {strings.search.button}
              </button>
            </div>
          </form>
        </div>

        {/* Filter chips */}
        <div
          className={`flex flex-wrap gap-2 mb-4 ${
            isRTL ? "justify-end" : "justify-start"
          }`}
        >
          <button
            className={`inline-flex items-center px-3 py-1 rounded-full ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } text-xs font-medium`}
            onClick={() => setFilter("all")}
          >
            {strings.filter.all}
          </button>
          <button
            className={`inline-flex items-center px-3 py-1 rounded-full ${
              filter === "pending"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } text-xs font-medium`}
            onClick={() => setFilter("pending")}
          >
            {strings.filter.pending}
          </button>
          <button
            className={`inline-flex items-center px-3 py-1 rounded-full ${
              filter === "verified"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } text-xs font-medium`}
            onClick={() => setFilter("verified")}
          >
            {strings.filter.verified}
          </button>
          <button
            className={`inline-flex items-center px-3 py-1 rounded-full ${
              filter === "rejected"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } text-xs font-medium`}
            onClick={() => setFilter("rejected")}
          >
            {strings.filter.rejected}
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredFirms.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {strings.accountingFirms.noFirmsFound}
                </p>
              </div>
            )}

            {/* Firms Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFirms.map((firm) => (
                <div
                  key={firm._id || firm.firmName}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    className="p-4"
                    style={{ textAlign: isRTL ? "right" : "left" }}
                  >
                    {/* Header section with firm name and status */}
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`text-sm font-semibold text-slate-900 line-clamp-1 ${
                          isRTL ? "ml-2" : "mr-2"
                        }`}
                      >
                        {firm.firmName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeStyles(
                          firm.status
                        )}`}
                      >
                        {getStatusIcon(firm.status)}
                        {strings.status[firm.status]}
                      </span>
                    </div>

                    {/* Rating and Size - combined in one row */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className={`flex ${isRTL ? "ml-1" : "mr-1"}`}>
                          {renderRatingStars(firm.rating)}
                        </div>
                        <span className="text-xs text-slate-500">
                          ({firm.rating})
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-slate-500">
                        <Users
                          className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}
                        />
                        <span>{firm.firmSize}</span>
                      </div>
                    </div>

                    {/* Specialization badge */}
                    <div className="mb-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded inline-block">
                        {firm.industrySpecialization}
                      </span>
                    </div>

                    {/* Description - shortened */}
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-snug">
                      {firm.description}
                    </p>

                    {/* Certification + Register - simplified */}
                    <div className="bg-slate-50 p-1.5 rounded text-xs text-slate-500 mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {strings.accountingFirms.regLabel}:
                        </span>
                        <span className={`truncate ${isRTL ? "mr-1" : "ml-1"}`}>
                          {firm.commercialRegister}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div
                      className={`flex ${
                        isRTL ? "justify-start" : "justify-end"
                      } ${isRTL ? "space-x-reverse" : ""} space-x-2`}
                    >
                      <button
                        onClick={() => onViewDetails(firm._id)}
                        className={`inline-flex items-center justify-center rounded bg-white px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-600 hover:bg-blue-50`}
                      >
                        <FileText
                          className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}
                        />
                        {strings.actions.details}
                      </button>

                      {firm.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(firm._id, "verified")
                          }
                          className="inline-flex items-center justify-center rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          <CheckCircle
                            className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}
                          />
                          {strings.actions.verify}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AccountingFirms;
