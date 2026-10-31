import SatsetLanding from "../SatsetLanding";
import { getSatsetMetadata } from "../metadata";

export const metadata = getSatsetMetadata("en");

export default function SatsetEnglishPage() {
  return <SatsetLanding lang="en" />;
}
