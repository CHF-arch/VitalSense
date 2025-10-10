import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClientById } from "../services/client";
import { fetchQuestionnaireSubmissionsByClientId } from "../services/questionnaireTemplate";
import ClientInfoCard from "../components/ClientInfoCard";
import QuestionnaireSubmissions from "../components/QuestionnaireSubmissions";
import BackButton from "../components/common/BackButton";


const ClientPage = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        setClient(clientData);
        const submissionData = await fetchQuestionnaireSubmissionsByClientId(
          clientId
        );
        setSubmissions(submissionData);
      } catch (err) {
        setError("Failed to fetch client data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "30px", alignItems: "center" }}>
      <BackButton/>
      {/* <div style={{ padding: "20px" }}> */}
        <ClientInfoCard client={client} />
        <QuestionnaireSubmissions submissions={submissions} />
      {/* </div> */}
    </div>
  );
};

export default ClientPage;

