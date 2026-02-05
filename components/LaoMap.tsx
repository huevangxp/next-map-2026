"use client";

import React, { useRef, useState, useCallback } from "react";
import Map, {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  Source,
  Layer,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { electionData } from "@/lib/election-data";

export default function LaoMap() {
  const mapRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features && event.features[0];
      const map = mapRef.current?.getMap();

      if (feature && map) {
        const id = feature.properties?.fips;

        // Clear previous selection
        if (selectedId) {
          map.setFeatureState(
            { source: "laos-provinces", id: selectedId },
            { selected: false },
          );
        }

        // Toggle or select new
        if (id && id !== selectedId) {
          map.setFeatureState(
            { source: "laos-provinces", id },
            { selected: true },
          );
          setSelectedId(id);
        } else {
          setSelectedId(null);
        }
      } else if (map && selectedId) {
        // Clicked nothing, clear selection
        map.setFeatureState(
          { source: "laos-provinces", id: selectedId },
          { selected: false },
        );
        setSelectedId(null);
      }
    },
    [selectedId],
  );

  return (
    <div className="w-full h-full relative group">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 102.6,
          latitude: 18.5,
          zoom: 6,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        interactiveLayerIds={["laos-provinces-fill"]}
        onClick={onClick}
      >
        <Source
          id="laos-provinces"
          type="geojson"
          data="/laos.geojson"
          promoteId="fips"
        >
          <Layer
            id="laos-provinces-fill"
            type="fill"
            paint={{
              "fill-color": [
                "match",
                ["get", "fips"],
                ...electionData.flatMap((d) => [d.id, d.partyColor]),
                "#cccccc",
              ] as any,
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.9,
                0.5,
              ] as any,
              "fill-outline-color": "#FFFFFF",
            }}
          />
          <Layer
            id="laos-provinces-line"
            type="line"
            paint={{
              "line-color": "#002868",
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                3,
                2,
              ] as any,
            }}
          />
        </Source>

        <NavigationControl position="top-right" />
        <ScaleControl />
        <FullscreenControl position="top-right" />
      </Map>

      {/* Overlay to show Lao colors integration */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 z-10">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
          Lao PDR
        </h3>
        <div className="flex gap-2">
          <div
            className="w-6 h-6 rounded-full bg-lao-red shadow-sm transform hover:scale-110 transition-transform"
            title="Lao Red"
          ></div>
          <div
            className="w-6 h-6 rounded-full bg-lao-blue shadow-sm transform hover:scale-110 transition-transform"
            title="Lao Blue"
          ></div>
          <div
            className="w-6 h-6 rounded-full bg-lao-white border border-gray-200 shadow-sm transform hover:scale-110 transition-transform"
            title="Lao White"
          ></div>
        </div>
      </div>
    </div>
  );
}
