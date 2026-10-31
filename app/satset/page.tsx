import SatsetLanding from "./SatsetLanding";
import { getSatsetMetadata } from "./metadata";

export const metadata = getSatsetMetadata("id");

export default function SatsetPage() {
  return <SatsetLanding lang="id" />;
}
