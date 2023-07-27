import {Sidebar} from "../components/Sidebar.tsx";
import {ContentWrapper} from "../styles/PageContent.ts";
import {Server} from "bbr-api";
import {useEffect, useState} from "react";
import bbrApiClient from "../utils/Api.ts";
import {Chart, ArcElement, Tooltip} from 'chart.js'
import {
    CardContainer,
    LegendColor, LegendItem,
    LegendText, PieContainer, StatChartTitle,
    StatsCardLong,
    StatsContainer,
    StatsPieChart,
    StatsPieChartContainer,
    StatsPieChartLegend
} from "../styles/StatComponents.ts";
import {HiOutlineUserGroup} from "react-icons/hi2";
import {Pie} from "react-chartjs-2";
import {HiOutlineClock} from "react-icons/hi";
import {toast} from "react-toastify";

Chart.register(ArcElement, Tooltip);

const colorMap: string[] = [
    "rgba(54,162,235,255)",
    "rgba(254,98,132,255)",
    "rgba(140,220,208,255)",
    "rgba(255,160,86,255)",
    "rgba(153,102,255,255)",
    "rgba(246,200,95,255)",
    "rgba(111,78,124,255)",
    "rgba(156,217,102,255)",
    "rgba(203,71,46,255)",
]

const createPieData = (label: string, data: Record<string, number>) => ({
    type: "pie",
    data: data,
    labels: [...Object.keys(data)],
    datasets: [
        {
            label: label,
            data: Object.values(data),
            backgroundColor: [
                ...colorMap,
            ],
            borderWidth: 2,
        }
    ]
});

function ServerStats() {
    const [servers, setServers] = useState<Server[]>([]);
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
            console.error("Error fetching servers: ", e);
            setError(true);
        } finally {
            setLoading(false);
            setError(false);
        }
    };

    const playerCount = servers.reduce((acc, server) => acc + server.Players, 0);
    const queuedPlayers = servers.reduce((acc, server) => acc + server.QueuePlayers, 0);

    const gameModePlayerCount = servers.reduce((acc, server) => {
        const gamemode = server.Gamemode;
        if (!acc[gamemode]) {
            acc[gamemode] = 0;
        }
        acc[gamemode] += server.Players;
        return acc;
    }, {} as Record<string, number>);

    const gameModeServerCount = servers.reduce((acc, server) => {
        const gamemode = server.Gamemode;
        if (!acc[gamemode]) {
            acc[gamemode] = 0;
        }
        acc[gamemode] += 1;
        return acc;
    }, {} as Record<string, number>);

    const regionPlayerCount = servers.reduce((acc, server) => {
        const region = server.Region;
        if (!acc[region]) {
            acc[region] = 0;
        }
        acc[region] += server.Players;
        return acc;
    }, {} as Record<string, number>);

    const regionServerCount = servers.reduce((acc, server) => {
        const region = server.Region;
        if (!acc[region]) {
            acc[region] = 0;
        }
        acc[region] += 1;
        return acc;
    }, {} as Record<string, number>);

    const mapPlayerCount = servers.reduce((acc, server) => {
        const map = server.Map;
        if (!acc[map]) {
            acc[map] = 0;
        }
        acc[map] += server.Players;
        return acc;
    }, {} as Record<string, number>);

    const mapServerCount = servers.reduce((acc, server) => {
        const map = server.Map;
        if (!acc[map]) {
            acc[map] = 0;
        }
        acc[map] += 1;
        return acc;
    }, {} as Record<string, number>);

    const mapSizeServerCount = servers.reduce((acc, server) => {
        const mapSize = server.MapSize;
        if (!acc[mapSize]) {
            acc[mapSize] = 0;
        }
        acc[mapSize] += 1;
        return acc;
    }, {} as Record<string, number>);

    const gameModePlayerPieData = createPieData("Game Mode Player Count", gameModePlayerCount)
    const gameModeServersPieData = createPieData("Game Mode Server Count", gameModeServerCount)
    const regionPlayerPieData = createPieData("Region Player Count", regionPlayerCount)
    const regionServerPieData = createPieData("Region Server Count", regionServerCount)
    const mapPlayerPieData = createPieData("Map Player Count", mapPlayerCount)
    const mapServerPieData = createPieData("Map Server Count", mapServerCount)
    const mapSizePieData = createPieData("Map Size Count", mapSizeServerCount)

    return (
        <>
            <Sidebar/>
            <ContentWrapper>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error fetching servers :(</p>
                ) : (
                    <>
                        <StatsContainer>
                            <CardContainer>
                                <StatsCardLong>
                                    <div>
                                        <h3>
                                            <HiOutlineUserGroup/>
                                            <span>Players</span>
                                        </h3>
                                        <p>
                                            <strong>{playerCount}</strong>
                                        </p>
                                    </div>
                                    <div>
                                        <h3>
                                            <HiOutlineClock/>
                                            <span>Queued Players</span>
                                        </h3>
                                        <p>
                                            <strong>{queuedPlayers}</strong>
                                        </p>
                                    </div>
                                </StatsCardLong>
                            </CardContainer>
                            <PieContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Game Mode Player Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={gameModePlayerPieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(gameModePlayerCount).map(([gamemode, count], index) => (
                                                <LegendItem key={gamemode}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{gamemode}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Gamemode Server Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={gameModeServersPieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(gameModeServerCount).map(([gamemode, count], index) => (
                                                <LegendItem key={gamemode}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{gamemode}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Region Player Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={regionPlayerPieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(regionPlayerCount).map(([region, count], index) => (
                                                <LegendItem key={region}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{region}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Region Server Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={regionServerPieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(regionServerCount).map(([region, count], index) => (
                                                <LegendItem key={region}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{region}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Map Player Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={mapPlayerPieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(mapPlayerCount).map(([map, count], index) => (
                                                <LegendItem key={map}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{map}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Map Server Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={mapServerPieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(mapServerCount).map(([map, count], index) => (
                                                <LegendItem key={map}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{map}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Map Size Count</StatChartTitle>
                                    <StatsPieChart>
                                        <Pie data={mapSizePieData}/>
                                        <StatsPieChartLegend>
                                            {Object.entries(mapSizeServerCount).map(([mapSize, count], index) => (
                                                <LegendItem key={mapSize}>
                                                    <LegendColor color={colorMap[index % colorMap.length]} />
                                                    <LegendText>
                                                        <p>{mapSize}: <strong>{count}</strong></p>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                            </PieContainer>
                        </StatsContainer>
                    </>
                )}
            </ContentWrapper>
        </>
    );
}

export default ServerStats;