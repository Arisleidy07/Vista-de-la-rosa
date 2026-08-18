import { useFirestoreData } from "./useFirestoreData.js";
import { getAppConfig } from "../services/firestore.js";

const fallbackConfig = {
  contact: {
    whatsapp: "18293410707",
    whatsappSecondary: "18296511212",
    phone: "",
    email: "",
  },
  location: {
    address: "Jarabacoa, República Dominicana",
    latitude: null,
    longitude: null,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Jarabacoa%2C%20Rep%C3%BAblica%20Dominicana",
  },
  hero: {
    video: {
      provider: "cloudinary",
      videoId: "vistadelarosa/videos/intro/intro",
      title: "Vista de la Rosa - Bienvenida",
      duration: null,
    },
    title: "Tu escape perfecto en las montañas",
    subtitle: "Villas privadas con amenidades premium en Jarabacoa.",
  },
};

export function useAppConfig() {
  const { data, loading, error } = useFirestoreData(getAppConfig, []);

  return {
    config: data || fallbackConfig,
    loading,
    error,
    usingFallback: !data && !loading,
  };
}
