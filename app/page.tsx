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
      <div className="flex h-screen w-screen items-center justify-center animate-fadeIn text-gray-900 dark:text-white">
        Loading Map...
      </div>
    );

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
        {/* Info Panel - 33% on Desktop */}
        <div className="lg:col-span-1 p-6 z-20 relative overflow-y-auto bg-white dark:bg-zinc-900 border-b lg:border-r border-gray-200 dark:border-gray-800 shadow-xl lg:shadow-none animate-slideUp order-2 lg:order-1 h-[40vh] lg:h-full">
          <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Lao Election 2026
            </h1>

            <div className="mb-6">
              <label
                htmlFor="province-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Select Province
              </label>
              <select
                id="province-select"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                value={selectedProvince || ""}
                onChange={(e) => handleProvinceSelect(e.target.value || null)}
              >
                <option value="">-- Choose a province --</option>
                {[...electionData]
                  .sort((a, b) => a.provinceName.localeCompare(b.provinceName))
                  .map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.provinceName}
                    </option>
                  ))}
              </select>
            </div>

            {selectedProvince ? (
              (() => {
                const data = electionData.find(
                  (d) => d.id === selectedProvince,
                );
                if (!data)
                  return <p className="text-gray-500">No data available</p>;
                return (
                  <div className="space-y-6 animate-scaleIn">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        {data.provinceName}
                      </h2>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Province ID:
                        </span>
                        <code className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-sm font-mono">
                          {data.id}
                        </code>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <span className="text-gray-600 dark:text-gray-400">
                          Winning Party
                        </span>
                        <span
                          className="font-bold px-3 py-1 rounded-full text-white shadow-sm"
                          style={{ backgroundColor: data.partyColor }}
                        >
                          {data.winningParty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <span className="text-gray-600 dark:text-gray-400">
                          Candidate
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {data.candidate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Votes
                        </span>
                        <span className="font-mono font-bold text-xl text-gray-900 dark:text-white">
                          {data.totalVotes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7"
                    />
                  </svg>
                </div>
                <p>
                  Select a province on the map
                  <br />
                  to view election details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section - 67% on Desktop */}
        <section className="lg:col-span-2 h-[60vh] lg:h-full relative order-1 lg:order-2">
          <ElectionMap
            geoJson={geoJson}
            electionData={electionData}
            onProvinceSelect={handleProvinceSelect}
          />
        </section>
      </div>
    </div>
  );
}
