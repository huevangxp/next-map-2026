"use client";

import { useEffect, useState } from "react";
import ElectionMap from "@/components/ElectionMap";
import { electionData, ProvinceElectionData } from "@/lib/election-data";
import type { FeatureCollection } from "geojson";

export default function Home() {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    fetch("/laos.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJson(data));
  }, []);

  const handleProvinceSelect = (provinceId: string | null) => {
    setSelectedProvince(provinceId);
    if (provinceId) {
      const provinceData = electionData.find((p) => p.id === provinceId);
      console.log("Selected Province Data:", provinceData);
    }
  };

  if (!geoJson)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading Map...
      </div>
    );

  return (
    <div>
      {/* Map Section */}
      <section className="w-screen h-screen overflow-hidden relative">
        <ElectionMap
          geoJson={geoJson}
          electionData={electionData}
          onProvinceSelect={handleProvinceSelect}
        />

        {selectedProvince && (
          <div className="absolute bottom-8 left-8 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-80 z-20 transition-all animate-in fade-in slide-in-from-bottom-4">
            {(() => {
              const data = electionData.find((d) => d.id === selectedProvince);
              if (!data) return <p>No data for this province</p>;
              return (
                <div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
                    {data.provinceName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Winner:</span>
                      <span
                        className="font-medium"
                        style={{ color: data.partyColor }}
                      >
                        {data.winningParty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Candidate:</span>
                      <span className="font-medium dark:text-zinc-200">
                        {data.candidate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Votes:</span>
                      <span className="font-medium dark:text-zinc-200">
                        {data.totalVotes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>
    </div>
  );
}
