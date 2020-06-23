import type { Map, TileLayer } from "leaflet";

// Sets up a Leaflet map on the provided DOM element
export type LeafletModuleType = typeof import("leaflet");
export type LeafletDrawModuleType = typeof import("leaflet-draw");

export const setupLeafletMap = async (
  mapElement: HTMLElement,
  darkMode?: boolean,
  draw = false
): Promise<[Map, LeafletModuleType, TileLayer]> => {
  if (!mapElement.parentNode) {
    throw new Error("Cannot setup Leaflet map on disconnected element");
  }
  // eslint-disable-next-line
  const Leaflet = ((await import(
    /* webpackChunkName: "leaflet" */ "leaflet"
  )) as any).default as LeafletModuleType;
  Leaflet.Icon.Default.imagePath = "/static/images/leaflet/images/";

  if (draw) {
    await import(/* webpackChunkName: "leaflet-draw" */ "leaflet-draw");
  }

  const map = Leaflet.map(mapElement);
  const style = document.createElement("link");
  style.setAttribute("href", "/static/images/leaflet/leaflet.css");
  style.setAttribute("rel", "stylesheet");
  mapElement.parentNode.appendChild(style);
  map.setView([52.3731339, 4.8903147], 13);

  const tileLayer = createTileLayer(Leaflet, Boolean(darkMode)).addTo(map);

  return [map, Leaflet, tileLayer];
};

export const replaceTileLayer = (
  leaflet: LeafletModuleType,
  map: Map,
  tileLayer: TileLayer,
  darkMode: boolean
): TileLayer => {
  map.removeLayer(tileLayer);
  tileLayer = createTileLayer(leaflet, darkMode);
  tileLayer.addTo(map);
  return tileLayer;
};

const createTileLayer = (
  leaflet: LeafletModuleType,
  darkMode: boolean
): TileLayer => {
  return leaflet.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
};
