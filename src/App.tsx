import { FaBars } from "react-icons/fa6";
import { Input } from "./components/input";
import { useEffect, useState, useTransition } from "react";
import { Station as StationType } from "./@types/station";
import { Station } from "./components/station";
import { getStations } from "./http/get-stations";
import { HTTPError } from "ky";

function App() {
  const [stations, setStations] = useState<StationType[]>([]);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getStations();
        setStations(
          response.map((station) => ({ ...station, favorite: false }))
        );
      } catch (err) {
        if (err instanceof HTTPError) {
          console.log(err.message);
        }
        alert(
          "Erro ao carregar estações de rádio! Por favor, tente mais tarde."
        );
      }
    });
  }, []);

  const handleFavorite = (stationUuid: string) => {
    setStations((prevStations) =>
      prevStations.map((station) =>
        station.serveruuid === stationUuid
          ? { ...station, favorite: !station.favorite }
          : station
      )
    );
  };

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-[244px_1fr] h-lvh">
      <aside className="bg-gray-100 p-5 flex flex-col items-start gap-5 border-r-1 border-gray-300">
        <div className="w-full flex justify-end">
          <FaBars size={25} className="text-gray-900" />
        </div>
        <Input
          placeholder="Search here"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-sm font-bold">Stations</h3>
          <div className="flex flex-col gap-1 w-full">
            {isPending && <p className="font-bold">Loading Stations...</p>}
            {filteredStations.length > 0
              ? filteredStations.map((station: StationType) => {
                  return (
                    <Station.Root key={station.serveruuid}>
                      <Station.Label label={station.name} />
                      <Station.Favorite
                        isFavorite={station.favorite}
                        onClick={() => handleFavorite(station.serveruuid)}
                      />
                    </Station.Root>
                  );
                })
              : stations.map((station: StationType) => {
                  return (
                    <Station.Root key={station.serveruuid}>
                      <Station.Label label={station.name} />
                      <Station.Favorite
                        isFavorite={station.favorite}
                        onClick={() => handleFavorite(station.serveruuid)}
                      />
                    </Station.Root>
                  );
                })}
          </div>
        </div>
      </aside>
      <main className="p-10 flex flex-col gap-5 items-start justify-center">
        <div className="max-h-[500px] h-full w-full flex flex-col gap-5 justify-start">
          <h1 className="text-2xl font-bold">Radio Browser</h1>

          <div className="w-full flex justify-between">
            <span className="text-xl">Favorite Radios</span>
            <Input
              placeholder="Search favorite stations"
              className="max-w-[200px]"
            />
          </div>
          <div>
            PLayer
            <Station.Root>
              <Station.Label label="Sertanejo brasil" />
            </Station.Root>
          </div>

          <div>
            {/* Mudar para ter somente Station.action */}

            {stations.some((station) => station.favorite) ? (
              stations.map((station) =>
                station.favorite ? (
                  <Station.Root key={station.serveruuid}>
                    <div>
                      <Station.Play />
                      <Station.Label label={station.name} />
                    </div>
                    <div>
                      <Station.Edit />
                      <Station.Delete />
                    </div>
                  </Station.Root>
                ) : null
              )
            ) : (
              <span>Nenhuma estação favorita ainda</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
