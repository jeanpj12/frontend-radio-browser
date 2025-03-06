import { FaBars } from "react-icons/fa6";
import { Input } from "./components/input";
import { useEffect, useRef, useState, useTransition } from "react";
import { Station as StationType } from "./@types/station";
import { Station } from "./components/station";
import { getStations } from "./http/get-stations";
import { HTTPError } from "ky";
import { FaPlay, FaStop } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { TbTrashFilled } from "react-icons/tb";
import { Tag } from "./components/tag";

function App() {
  const [stations, setStations] = useState<StationType[]>([]);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFavoriteTerm, setSearchFavoriteTerm] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [playingStationId, setPlayingStationId] = useState<string | null>(null);
  const [lastPlayedStation, setLastPlayedStation] =
    useState<StationType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getStations();
        setStations(
          response.map((station) => ({
            ...station,
            favorite: false,
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

  const filteredFavoriteStations = stations
    .filter((station) => station.favorite)
    .filter((station) =>
      station.name.toLowerCase().includes(searchFavoriteTerm.toLowerCase())
    );

  const handlePlay = (serveruuid: string) => {
    const selectedStation = stations.find((s) => s.serveruuid === serveruuid);

    if (!selectedStation) return;

    if (playingStationId === serveruuid) {
      audioRef.current.pause();
      setPlayingStationId(null);
    } else {
      audioRef.current.pause();
      audioRef.current.src = selectedStation.url_resolved;
      audioRef.current.play().catch(() => {
        alert("Erro ao tocar estação " + selectedStation.name);
        audioRef.current.pause();
        setPlayingStationId(null);
      });

      setPlayingStationId(serveruuid);
      setLastPlayedStation(selectedStation);
    }
  };

  return (
    <div className="grid md:grid-cols-[244px_1fr] h-lvh">
      {/* SIDEBAR COM ESTAÇOES DE RÁDIOS */}
      <aside
        className={`bg-gray-100 p-5 flex flex-col items-start gap-5 border-r border-gray-300
          fixed md:relative top-0 left-0 h-full transform transition-transform duration-300
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="w-full flex justify-end">
          <button className="" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars size={25} className="text-gray-900" />
          </button>
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
      <main className="md:p-20 p-8 flex flex-col gap-5 items-start md:justify-center">
        <div className="w-full flex md:hidden justify-start">
          <button className="" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars size={25} className="text-gray-900" />
          </button>
        </div>
        <div className="w-full flex flex-col gap-5 justify-start md:max-h-[500px] overflow-hidden">
          <h1 className="text-2xl font-bold">Radio Browser</h1>
          <div className="w-full flex justify-between flex-col md:flex-row gap-2">
            <span className="text-xl">Favorite Radios</span>
            <Input
              placeholder="Search favorite stations"
              className="max-w-[200px]"
              onChange={(e) => setSearchFavoriteTerm(e.target.value)}
            />
          </div>
          {/* PLAYER DA RÁDIO */}

          <div className="p-2 bg-gray-200 rounded-md">
            <Station.Root>
              <div className="flex gap-2 items-center">
                {lastPlayedStation ? (
                  <Station.Root key={lastPlayedStation.serveruuid}>
                    <div className="flex gap-2 items-center">
                      <Station.Action
                        Icon={
                          playingStationId === lastPlayedStation.serveruuid
                            ? FaStop
                            : FaPlay
                        }
                        onClick={() => handlePlay(lastPlayedStation.serveruuid)}
                      />
                      <Station.Label
                        label={`${
                          audioRef.current.paused ? "Stoped" : "Playing"
                        } ${lastPlayedStation.name}`}
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
          <div className="h-[500px] overflow-auto scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar scrollbar-thumb-gray-400 scrollbar-track-slate-300/0">
            {filteredFavoriteStations.length > 0 ? (
              filteredFavoriteStations.map((station) => (
                <div
                  key={station.serveruuid}
                  onMouseEnter={() => setHovered(station.serveruuid)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Station.Root>
                    <div className="flex gap-2 items-center">
                      <Station.Action
                        Icon={
                          playingStationId === station.serveruuid
                            ? FaStop
                            : FaPlay
                        }
                        onClick={() => handlePlay(station.serveruuid)}
                      />
                      <div className="flex flex-col gap-1">
                        <div>
                          <Station.Label label={station.name} />
                          {playingStationId === station.serveruuid && (
                            <span className="text-sm">(Playing...)</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Tag label={station.country}/>
                          <Tag label="Rock" />
                          <Tag label="News" />
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden flex gap-2 items-center">
                      <Station.Action Icon={MdModeEdit} />
                      <Station.Action
                        Icon={TbTrashFilled}
                        onClick={() => handleFavorite(station.serveruuid)}
                      />
                    </div>

                    <div className="hidden md:flex gap-2 items-center">
                      {hovered === station.serveruuid && (
                        <>
                          <Station.Action Icon={MdModeEdit} />
                          <Station.Action
                            Icon={TbTrashFilled}
                            onClick={() => handleFavorite(station.serveruuid)}
                          />
                        </>
                      )}
                    </div>
                  </Station.Root>
                </div>
              ))
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
