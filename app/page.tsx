import Image from "next/image";
import LaoMap from "@/components/LaoMap";

export default function Home() {
  return (
    <div>
      {/* Map Section */}
      <section className="w-full flex justify-center">
        <div className="w-full ">
          <LaoMap />
        </div>
      </section>
    </div>
  );
}
