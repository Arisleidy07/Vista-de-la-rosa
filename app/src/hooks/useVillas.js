import { useMemo } from "react";
import { useFirestoreData } from "./useFirestoreData.js";
import { getActiveVillas } from "../services/firestore.js";
import { villas as localVillas, blockDetailConfig } from "../data/villas.js";

function normalizeImages(list, prefix) {
  return (list || []).map((url, order) => ({
    url,
    alt: `${prefix} - imagen ${order + 1}`,
    order,
  }));
}

function normalizeVariants(blockNumber, title) {
  const cfg = blockDetailConfig[blockNumber] || {};
  const variants = cfg.variants;
  if (!variants) return null;

  const result = {};
  for (const [key, data] of Object.entries(variants)) {
    result[key] = {
      key,
      label: data.label,
      thumb: data.thumb || null,
      images: normalizeImages(data.images, `${title} - ${data.label}`),
    };
  }
  return result;
}

function normalizeLocalVillas(villas) {
  return villas.map((villa) => ({
    ...villa,
    capacityLabel: cfgFor(villa.block).capacity || villa.capacity,
    rooms: cfgFor(villa.block).rooms || villa.rooms,
    baths: cfgFor(villa.block).baths || villa.baths,
    amenities: cfgFor(villa.block).amenities || villa.amenities,
    images: normalizeImages(villa.images, villa.title),
    variants: normalizeVariants(villa.block, villa.title),
    video: villa.video || null,
  }));
}

function cfgFor(block) {
  return blockDetailConfig[block] || {};
}

export function useVillas() {
  const { data, loading, error } = useFirestoreData(getActiveVillas, []);

  const fallback = useMemo(() => normalizeLocalVillas(localVillas), []);

  return {
    villas: data || fallback,
    loading,
    error,
    usingFallback: !data && !loading,
  };
}
