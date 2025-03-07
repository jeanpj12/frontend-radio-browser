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
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Tag } from "./components/tag";
import { Modal } from "./components/modal";
import { IoIosCloseCircle } from "react-icons/io";

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
  const [editStation, setEditStation] = useState<StationType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const stationsPerPage = 10;

  const [favorites, setFavorites] = useState<string[]>([]);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteStations");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getStations();
        setStations(
          response.map((station) => ({
            ...station,
            favorite: favorites.includes(station.stationuuid),
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
  }, [favorites]);

  const handleFavorite = (stationUuid: string) => {
    setStations((prevStations) =>
      prevStations.map((station) =>
        station.stationuuid === stationUuid
          ? { ...station, favorite: !station.favorite }
          : station
      )
    );

    const isFavorite = favorites.includes(stationUuid);

    let updatedFavorites = [];

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav !== stationUuid);
    } else {
      updatedFavorites = [...favorites, stationUuid];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteStations", JSON.stringify(updatedFavorites));
  };

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStations.length / stationsPerPage);
  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = filteredStations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredFavoriteStations = stations
    .filter((station) => station.favorite)
    .filter(
      (station) =>
        station.name.toLowerCase().includes(searchFavoriteTerm.toLowerCase()) ||
        station.country
          .toLowerCase()
          .includes(searchFavoriteTerm.toLowerCase()) ||
        station.language
          .toLowerCase()
          .includes(searchFavoriteTerm.toLowerCase())
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

  const handleEdit = (serveruuid: string) => {
    const station = stations.find((s) => s.serveruuid === serveruuid);
    if (station) {
      setEditStation({ ...station });
      setOpenModal(true);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editStation) {
      setEditStation({
        ...editStation,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSendEditedStation = (serveruuid: string) => {
    if (editStation) {
      setStations(
        stations.map((station) =>
          station.serveruuid === serveruuid
            ? { ...station, ...editStation }
            : station
        )
      );
    }

    setEditStation(null);
    setOpenModal(false);
  };

  const handleDeleteTag = (tag: string) => {
    if (editStation) {
      const tagsArray = editStation.tags.split(",").filter((t) => t !== tag);
      setEditStation({
        ...editStation,
        tags: tagsArray.join(","),
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && editStation) {
      setEditStation({
        ...editStation,
        tags: editStation.tags ? `${editStation.tags},${newTag}` : newTag,
      });
      setNewTag("");
    }
  };

  return (
    <div className="grid md:grid-cols-[244px_1fr] h-lvh">
      {/* SIDEBAR COM ESTAÇOES DE RÁDIOS */}
      <aside
        className={`bg-gray-100 p-5 flex flex-col items-start gap-5 border-r border-gray-300
          fixed md:relative top-0 left-0 h-full transform transition-transform duration-300
          overflow-hidden
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
          <div className="flex flex-col gap-1 w-full max-h-full overflow-auto scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar scrollbar-thumb-gray-400 scrollbar-track-slate-300/0">
            {isPending && <p className="font-bold">Loading Stations...</p>}
            {currentStations.length > 0 ? (
              currentStations.map((station: StationType) => {
                return (
                  <Station.Root key={station.stationuuid}>
                    <Station.Label label={station.name} />
                    {station.favorite ? (
                      <Station.Action
                        Icon={MdFavorite}
                        onClick={() => handleFavorite(station.stationuuid)}
                      />
                    ) : (
                      <Station.Action
                        Icon={MdFavoriteBorder}
                        onClick={() => handleFavorite(station.stationuuid)}
                      />
                    )}
                  </Station.Root>
                );
              })
            ) : (
              <p>No stations found</p>
            )}
          </div>

          {/* CONTROLE DE PAGINACAO */}

          {filteredStations.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1 rounded ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                <IoChevronBack size={18} />
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                <IoChevronForward size={18} />
              </button>
            </div>
          )}
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
                          <Tag label={station.country} />
                          {station.tags &&
                            station.tags
                              .split(",")
                              .map((tag) => <Tag key={tag} label={tag} />)}
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden flex gap-2 items-center">
                      <Station.Action
                        Icon={MdModeEdit}
                        onClick={() => handleEdit(station.serveruuid)}
                      />
                      <Station.Action
                        Icon={TbTrashFilled}
                        onClick={() => handleFavorite(station.serveruuid)}
                      />
                    </div>

                    <div className="hidden md:flex gap-2 items-center">
                      {hovered === station.serveruuid && (
                        <>
                          <Station.Action
                            Icon={MdModeEdit}
                            onClick={() => handleEdit(station.serveruuid)}
                          />
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

        {openModal && (
          <Modal.Root>
            <Modal.Header
              title="Edit station"
              onAction={() => setOpenModal((prev) => !prev)}
            />
            <Modal.Content className="flex flex-col gap-2">
              <Input
                value={editStation?.name}
                name="name"
                onChange={handleEditInputChange}
              />
              <Input
                value={editStation?.country}
                name="country"
                onChange={handleEditInputChange}
              />
              <div className="grid grid-cols-[1fr_150px] gap-2">
                <Input
                  name="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  className="py-2 px-4 bg-gray-900 text-white rounded-md"
                  onClick={handleAddTag}
                >
                  Adicionar tag
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {editStation?.tags &&
                  editStation?.tags
                    .split(",")
                    .map((tag) => (
                      <Tag
                        key={tag}
                        label={tag}
                        Icon={IoIosCloseCircle}
                        onAction={() => handleDeleteTag(tag)}
                      />
                    ))}
              </div>
              <button
                className="py-2 px-4 bg-gray-900 text-white rounded-md cursor-pointer"
                onClick={() =>
                  editStation?.serveruuid &&
                  handleSendEditedStation(editStation.serveruuid)
                }
              >
                Salvar Edição
              </button>
            </Modal.Content>
          </Modal.Root>
        )}
      </main>
    </div>
  );
}

export default App;
