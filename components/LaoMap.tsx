import React, { useRef, useState, useCallback, useMemo } from "react";
import ReactMap, {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  Source,
  Layer,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { electionData } from "@/lib/election-data";
import { cityData } from "@/lib/city-data";

export default function LaoMap() {
  const mapRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features && event.features[0];
      const map = mapRef.current?.getMap();

      if (feature && map) {
        // If clicked on a city, do nothing or handle differently (optional, but preventing map click logic from deselecting if clicking a city point might be good. For now let's assume cities are not interactive or just visual).
        if (feature.source === "province-cities") return;

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

  const citiesGeoJson = useMemo(() => {
    if (!selectedId) return null;
    const cities = cityData.filter((c) => c.provinceId === selectedId);
    return {
      type: "FeatureCollection",
      features: cities.map((city, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: city.coordinates,
        },
        properties: {
          name: city.name,
          id: index,
        },
      })),
    };
  }, [selectedId]);

  return (
    <div className="w-full h-full relative group bg-zinc-100 dark:bg-zinc-950">
      <ReactMap
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
          data="/data/la.json"
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

        {citiesGeoJson && (
          <Source
            id="province-cities"
            type="geojson"
            data={citiesGeoJson as any}
          >
            <Layer
              id="cities-circle"
              type="circle"
              paint={{
                "circle-color": "#ffffff",
                "circle-radius": 5,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#000000",
              }}
            />
            <Layer
              id="cities-label"
              type="symbol"
              layout={{
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 12,
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              }}
              paint={{
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
              }}
            />
          </Source>
        )}

        <NavigationControl position="top-right" showCompass={false} />
        <ScaleControl position="bottom-right" />
        <FullscreenControl position="top-right" />
      </ReactMap>

      {/* Modern Glassmorphic Info Overlay */}
      <div className="absolute top-6 left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 min-w-[220px] animate-fadeIn hover:bg-white/95 dark:hover:bg-zinc-900/95 transition-all">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1 tracking-tight">
          Lao PDR
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-4">
          National Colors & Identity
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 group">
            <div
              className="w-4 h-4 rounded-full bg-lao-red shadow-sm ring-1 ring-black/5 dark:ring-white/10 transform group-hover:scale-110 transition-transform"
              title="Lao Red"
            ></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium group-hover:text-lao-red transition-colors">
              National Red
            </span>
          </div>

          <div className="flex items-center gap-3 group">
            <div
              className="w-4 h-4 rounded-full bg-lao-blue shadow-sm ring-1 ring-black/5 dark:ring-white/10 transform group-hover:scale-110 transition-transform"
              title="Lao Blue"
            ></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium group-hover:text-lao-blue transition-colors">
              National Blue
            </span>
          </div>

          <div className="flex items-center gap-3 group">
            <div
              className="w-4 h-4 rounded-full bg-lao-white border border-gray-200 dark:border-gray-600 shadow-sm transform group-hover:scale-110 transition-transform"
              title="Lao White"
            ></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
              Pure White
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            Select provinces for details
          </span>
        </div>
      </div>
    </div>
  );
}
