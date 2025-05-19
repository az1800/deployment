import FAQCard from "./FAQCard";
import "../ComopnentsCss/FAQsSection.css";
import Pagination from "./Pagination";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../Contexts/LanguageContext";

function FAQsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);
  const [faqData, setFaqData] = useState([]); // State to store fetched FAQ data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const { language } = useContext(LanguageContext);
  const fakeData = [
    {
      title: "the accountant prepares the financial statement",
      subtitle: "Accurate records are the foundation of business success",
      titleArabic: "المحاسب يُعد البيان المالي",
      subtitleArabic: "السجلات الدقيقة هي أساس نجاح الأعمال",
    },
    {
      title: "the auditor reviews the tax return",
      subtitle: "Thorough checks ensure compliance and transparency",
      titleArabic: "المراجع يراجع الإقرار الضريبي",
      subtitleArabic: "الفحوصات الدقيقة تضمن الامتثال والشفافية",
    },
    {
      title: "the bookkeeper tracks all transactions",
      subtitle: "Details matter for financial clarity",
      titleArabic: "محاسب الحسابات يتتبع جميع المعاملات",
      subtitleArabic: "التفاصيل مهمة من أجل وضوح مالي",
    },
    {
      title: "the CFO approves the annual budget",
      subtitle: "Strategic planning drives long-term growth",
      titleArabic: "المدير المالي يوافق على الميزانية السنوية",
      subtitleArabic: "التخطيط الاستراتيجي يقود النمو على المدى الطويل",
    },
    {
      title: "the tax consultant advises on deductions",
      subtitle: "Maximizing savings requires in-depth knowledge",
      titleArabic: "استشاري الضرائب ينصح بالحسومات",
      subtitleArabic: "تعظيم التوفير يتطلب معرفة عميقة",
    },
    {
      title: "the finance team analyzes the profit margins",
      subtitle: "Data-driven decisions lead to sustainable profits",
      titleArabic: "فريق المالية يحلل هوامش الربح",
      subtitleArabic: "القرارات المعتمدة على البيانات تؤدي إلى أرباح مستدامة",
    },
    {
      title: "the financial analyst projects future revenue",
      subtitle: "Forecasting helps navigate economic uncertainties",
      titleArabic: "المحلل المالي يتنبأ بالإيرادات المستقبلية",
      subtitleArabic: "التوقعات تساعد في التنقل بين التقلبات الاقتصادية",
    },
    {
      title: "the accountant reconciles bank statements",
      subtitle: "Consistency and accuracy prevent financial discrepancies",
      titleArabic: "المحاسب يطابق كشوف الحسابات البنكية",
      subtitleArabic: "الاتساق والدقة تمنع التناقضات المالية",
    },
    {
      title: "the payroll specialist calculates salaries",
      subtitle: "Fair compensation builds employee trust",
      titleArabic: "أخصائي الرواتب يحسب الأجور",
      subtitleArabic: "التعويض العادل يبني الثقة بين الموظفين",
    },
    {
      title: "the investment advisor evaluates market risks",
      subtitle: "Smart investments require careful assessment",
      titleArabic: "مستشار الاستثمار يقيم مخاطر السوق",
      subtitleArabic: "الاستثمارات الذكية تتطلب تقييم دقيق",
    },
    {
      title: "the investment advisor evaluates market risks",
      subtitle: "Smart investments require careful assessment",
      titleArabic: "مستشار الاستثمار يقيم مخاطر السوق",
      subtitleArabic: "الاستثمارات الذكية تتطلب تقييم دقيق",
    },
  ];
  // Fetch FAQ data from the backend when the component loads
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/faq`,
          {
            method: "GET", // Use GET to retrieve FAQs
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials if needed
          }
        );

        if (response.ok) {
          const data = await response.json(); // Parse the response JSON
          setFaqData(data); // Store the fetched FAQs in state
        } else {
          console.error("Failed to fetch FAQs:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFAQs();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Pagination logic
  const lastCardIndex = currentPage * cardsPerPage;
  const firstCardIndex = lastCardIndex - cardsPerPage;
  const currentCards = faqData.slice(firstCardIndex, lastCardIndex);
  const totalCards = faqData.length;

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Display loading state while fetching data
  if (loading) {
    return <div>Loading FAQs...</div>;
  }

  // Display message if no FAQs are found
  if (faqData.length === 0) {
    return <div>No FAQs found.</div>;
  }

  return (
    <>
      <h1 className="FAQText">
        {language === "En" ? "FAQ" : "الأسئلة الشائعة"}
      </h1>
      <div className={language === "En" ? "FAQSection" : "FAQSection-Ar"}>
        {currentCards.map((item, index) => (
          <FAQCard
            key={index}
            Title={language === "En" ? item.title : item.titleArabic}
            Subtitle={language === "En" ? item.subtitle : item.subtitleArabic}
          />
        ))}
      </div>
      <Pagination
        pagenumbers={pageNumbers}
        setPageNumber={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
}

export default FAQsSection;
