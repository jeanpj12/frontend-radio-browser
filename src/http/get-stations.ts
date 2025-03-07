import { Station } from "@/@types/station";
import { api } from "./api-client";

export async function getStations() {
  const response = await api
    .get("json/stations/search?limit=30")
    .json<Station[]>();
  return response;
}
