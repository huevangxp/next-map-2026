import Image from "next/image";
import LaoMap from "@/components/LaoMap";

export default function Home() {
  return (
    <div>
      {/* Map Section */}
      <section className="w-screen h-screen overflow-hidden">
        <LaoMap />
      </section>
    </div>
  );
}
