import React, {useEffect, useState} from "react";
import {Sidebar} from "../components/Sidebar.tsx";
import {Server} from "bbr-api";
import bbrApiClient from "../utils/Api.ts";
import {
    ServerListFilterLabel,
    ServerListFilterWrapper,
    ServerListSearchInput,
    ServerListTable,
    ServerListTableData,
    ServerListTableHeader,
    ServerListTableRow,
} from "../styles/ServerList.ts";
import {ContentWrapper} from "../styles/PageContent.ts";
import {toast} from "react-toastify";

const columns = [
    "Name",
    "Map",
    "MapSize",
    "Gamemode",
    "Region",
    "Players",
    "QueuePlayers",
    "MaxPlayers",
    "Hz",
    "DayNight",
    "IsOfficial",
    "HasPassword",
    "AntiCheat",
    "Build",
];

function ServerList() {
    const [servers, setServers] = useState<Server[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortKey, setSortKey] = useState<string | null>("Name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "r") {
                toast.promise(fetchData(), {
                    pending: "Refreshing server stats...",
                    success: "Refreshed!",
                    error: "Error refreshing servers",
                });
            }
        };

        toast.promise(fetchData(), {
            error: "Error fetching servers",
        }).then(() => {
            toast.info("Press R to refresh server stats");
        });

        window.addEventListener("keydown", handleKeyDown);

        const interval = setInterval(() => {
            toast.promise(fetchData(), {
                pending: "Refreshing...",
                success: "Refreshed!",
                error: "Error refreshing servers",
            });
        }, 1000 * 60 * 5);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearInterval(interval);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await bbrApiClient.getServerList();
            setServers(response.servers);
        } catch (e) {
            console.error('Error fetching servers: ', e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleHeaderClick = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const sortedServers = [...servers];

    if (sortKey) {
        sortedServers.sort((a, b) => {
            const aValue = a[sortKey as keyof Server];
            const bValue = b[sortKey as keyof Server];

            if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue);
            } else if (typeof aValue === "number" && typeof bValue === "number") {
                return aValue - bValue;
            }

            return 0;
        });

        if (sortDirection === "desc") {
            sortedServers.reverse();
        }
    }

    const searchedServers = sortedServers.filter((server) => {
        return server.Name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <Sidebar/>
            <ContentWrapper>
                {loading ? (
                    <tbody>
                    <tr>
                        <td colSpan={columns.length}>Loading...</td>
                    </tr>
                    </tbody>
                ) : error ? (
                    <tbody>
                    <tr>
                        <td colSpan={columns.length}>Error loading servers</td>
                    </tr>
                    </tbody>
                ) : (
                    <>
                        <h1>Server List</h1>
                        <div>
                            <ServerListFilterWrapper>
                                <ServerListFilterLabel>
                                    Search:
                                    <ServerListSearchInput type="text" value={searchTerm}
                                                           onChange={handleSearchChange}/>
                                </ServerListFilterLabel>
                            </ServerListFilterWrapper>
                        </div>
                        <ServerListTable>
                            <thead>
                            <tr>
                                {columns.map((column) => (
                                    <ServerListTableHeader
                                        key={column}
                                        onClick={() => handleHeaderClick(column)}
                                        sortDirection={sortDirection}
                                        isSorted={sortKey === column}
                                    >
                                        {column}
                                    </ServerListTableHeader>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {searchedServers.map((server) => (
                                <ServerListTableRow key={server.Name}>
                                    {columns.map((column) => (
                                        <ServerListTableData key={column}>
                                            {column === "IsOfficial" || column === "HasPassword"
                                                ? server[column as keyof Server]
                                                    ? "Yes"
                                                    : "No"
                                                : server[column as keyof Server]}
                                        </ServerListTableData>
                                    ))}
                                </ServerListTableRow>
                            ))}
                            </tbody>
                        </ServerListTable>
                    </>
                )}
            </ContentWrapper>
        </div>
    );
}

export default ServerList;