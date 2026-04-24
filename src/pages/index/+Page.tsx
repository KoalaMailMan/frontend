import App from "@/App";
import "../../styles/globals.css";
import "../../styles/loading_ui.css";
import { enableMapSet } from "immer";

enableMapSet();

export default function Page() {
  return <App />;
}
