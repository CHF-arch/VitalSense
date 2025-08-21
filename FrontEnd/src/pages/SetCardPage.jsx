import SetCard from "../components/SetCard/SetCard";
import { useParams } from "react-router-dom";

export default function SetCardPage() {
  const { clientId } = useParams();
  return <SetCard clientId={clientId} />;
}
