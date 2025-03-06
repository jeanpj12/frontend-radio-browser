import { FaBars } from "react-icons/fa6";
import { Input } from "./components/input";
import { useEffect, useState, useTransition } from "react";
import { Station as StationType } from "./@types/station";
import { Station } from "./components/station";
import { getStations } from "./http/get-stations";
import { HTTPError } from "ky";
import { FaPlay, FaStop } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";

function App() {
  const [stations, setStations] = useState<StationType[]>([]);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [lastPlayedStation, setLastPlayedStation] =
    useState<StationType | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getStations();
        setStations(
          response.map((station) => ({
            ...station,
            favorite: false,
            playing: false,
          }))
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

  const handlePlay = (serveruuid: string) => {
    setStations((prevStations) =>
      prevStations.map((station) =>
        station.serveruuid === serveruuid
          ? { ...station, playing: !station.playing }
          : { ...station, playing: false }
      )
    );

    const selectedStation = stations.find((s) => s.serveruuid === serveruuid);
    if (selectedStation) setLastPlayedStation(selectedStation);
  };

  return (
    <div className="grid grid-cols-[244px_1fr] h-lvh">
      {/* SIDEBAR COM ESTAÇOES DE RÁDIOS */}

      <aside className="bg-gray-100 p-5 flex flex-col items-start gap-5 border-r-1 border-gray-300">
        <div className="w-full flex justify-end">
          <FaBars size={25} className="text-gray-900" />
        </div>

        <Input
          placeholder="Search here"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* LISTAGEM DE RÁDIOS */}

        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-sm font-bold">Stations</h3>
          <div className="flex flex-col gap-1 w-full">
            {isPending && <p className="font-bold">Loading Stations...</p>}
            {filteredStations.length > 0
              ? filteredStations.map((station: StationType) => {
                  return (
                    <Station.Root key={station.serveruuid}>
                      <Station.Label label={station.name} />
                      {station.favorite ? (
                        <Station.Action
                          Icon={MdFavorite}
                          onClick={() => handleFavorite(station.serveruuid)}
                        />
                      ) : (
                        <Station.Action
                          Icon={MdFavoriteBorder}
                          onClick={() => handleFavorite(station.serveruuid)}
                        />
                      )}
                    </Station.Root>
                  );
                })
              : stations.map((station: StationType) => {
                  return (
                    <Station.Root key={station.serveruuid}>
                      <Station.Label label={station.name} />
                      <Station.Action
                        Icon={station.favorite ? MdFavorite : MdFavoriteBorder}
                        onClick={() => handleFavorite(station.serveruuid)}
                      />
                    </Station.Root>
                  );
                })}
          </div>
        </div>
      </aside>
      <main className="p-20 flex flex-col gap-5 items-start justify-center">
        <div className="max-h-[500px] h-full w-full flex flex-col gap-5 justify-start">
          <h1 className="text-2xl font-bold">Radio Browser</h1>
          <div className="w-full flex justify-between">
            <span className="text-xl">Favorite Radios</span>
            <Input
              placeholder="Search favorite stations"
              className="max-w-[200px]"
            />
          </div>
          {/* PLAYER DA RÁDIO */}
          <div className="p-2 bg-gray-200 rounded-md">
            <Station.Root>
              <div className="flex gap-2 items-center">
                {stations.some((station) => station.playing) ||
                lastPlayedStation ? (
                  <Station.Root key={lastPlayedStation?.serveruuid}>
                    <div className="flex gap-2 items-center">
                      <Station.Action
                        Icon={lastPlayedStation?.playing ? FaStop : FaPlay}
                        onClick={() =>
                          lastPlayedStation &&
                          handlePlay(lastPlayedStation.serveruuid)
                        }
                      />
                      <Station.Label
                        label={lastPlayedStation?.name || ""}
                        className="text-xl font-semibold"
                      />
                    </div>
                  </Station.Root>
                ) : (
                  <span>Nenhuma rádio tocando</span>
                )}
              </div>
            </Station.Root>
          </div>
          {/* RÁDIOS FAVORITAS */}
          <div>
            {stations.some((station) => station.favorite) ? (
              stations.map((station) =>
                station.favorite ? (
                  <div
                    key={station.serveruuid}
                    onMouseEnter={() => setHovered(station.serveruuid)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Station.Root>
                      <div className="flex gap-2 items-center">
                        <Station.Action
                          Icon={station.playing ? FaPlay : FaStop}
                          onClick={() => handlePlay(station.serveruuid)}
                        />

                        <Station.Label label={station.name} />
                      </div>
                      {hovered === station.serveruuid && (
                        <div className="flex gap-2 items-center">
                          <Station.Action Icon={MdModeEdit} />
                          <Station.Action
                            Icon={TbTrashFilled}
                            onClick={() => handleFavorite(station.serveruuid)}
                          />
                        </div>
                      )}
                    </Station.Root>
                  </div>
                ) : null
              )
            ) : (
              <span>Nenhuma estação favorita ainda</span>
            )}
          </div>
          ;
        </div>
      </main>
    </div>
  );
}

export default App;
