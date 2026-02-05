"use client";

import React from "react";
import Map, {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LaoMap() {
  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 relative group">
      <Map
        initialViewState={{
          longitude: 102.6,
          latitude: 18.5,
          zoom: 6,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        interactiveLayerIds={["laos-provinces-fill"]}
      >
        <Source id="laos-provinces" type="geojson" data="/laos.geojson">
          <Layer
            id="laos-provinces-fill"
            type="fill"
            paint={{
              "fill-color": "#CE1126", // Initial default, will be data-driven later
              "fill-opacity": 0.5,
              "fill-outline-color": "#FFFFFF",
            }}
          />
          <Layer
            id="laos-provinces-line"
            type="line"
            paint={{
              "line-color": "#002868",
              "line-width": 2,
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
