import {Sidebar} from "../components/Sidebar.tsx";
import {ContentWrapper} from "../styles/PageContent.ts";
import {Server} from "bbr-api";
import {useEffect, useState} from "react";
import bbrApiClient from "../utils/Api.ts";
import {
    Chart,
    ArcElement,
    LineElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Legend,
    Filler
} from 'chart.js'
import {
    CardContainer,
    LegendColor,
    LegendItem,
    LegendText, LineChartContainer, LineChartTitle, LineChartWrapper, PieChartWrapper,
    PieContainer,
    StatChartTitle,
    StatsCard,
    StatsContainer,
    StatsPieChart,
    StatsPieChartContainer,
    StatsPieChartLegend
} from "../styles/StatComponents.ts";
import {Line, Pie} from "react-chartjs-2";
import {toast} from "react-toastify";
import {HiOutlineServerStack, HiOutlineUserGroup, HiOutlineUserCircle, HiOutlineClock} from "react-icons/hi2";
import {TbBuildingCommunity} from "react-icons/tb";
import {AiOutlineCloudServer} from "react-icons/ai";
import {format} from "date-fns";

Chart.register(ArcElement, LineElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
];

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

const pieOptions = {
    plugins: {
        legend: {
            display: false,
        }
    }
}

let refreshInterval: number;

function ServerStats() {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [playerLineChartData, setPlayerLineChartData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: "Player Count",
                data: [] as number[],
                borderColor: colorMap[0],
                borderWidth: 2,
                fill: true,
                showLine: true,
            },
            {
                label: "Max Server Capacity",
                data: [] as number[],
                borderColor: colorMap[1],
                borderWidth: 2,
                fill: true,
                showLine: true,
            },
            {
                label: "Queued Players",
                data: [] as number[],
                borderColor: colorMap[2],
                borderWidth: 2,
                fill: true,
                showLine: true,
            }
        ],
    });
    const [serverLineChartData, setServerLineChartData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: "Server Count",
                data: [] as number[],
                borderColor: colorMap[0],
                borderWidth: 2,
                fill: true,
                showLine: true,
            },
            {
                label: "Official Servers",
                data: [] as number[],
                borderColor: colorMap[1],
                borderWidth: 2,
                fill: true,
                showLine: true,
            },
            {
                label: "Community Servers",
                data: [] as number[],
                borderColor: colorMap[2],
                borderWidth: 2,
                fill: true,
                showLine: true,
            }
        ],
    });

    useEffect(() => {
        let isFocused = document.hasFocus();

        const fetchDataAndToast = () => {
            toast.promise(fetchData(), {
                pending: "Refreshing...",
                success: "Refreshed!",
                error: "Error refreshing servers",
            }).then(() => {
            });
        };

        toast.promise(fetchData(), {
            error: "Error fetching servers",
        }).then(() => {
            toast.info("Press ALT + R to refresh server stats");
        });

        refreshInterval = setInterval(() => {
            if (isFocused) {
                fetchDataAndToast();
            }
        }, 1000 * 60);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "r" && e.altKey) {
                fetchDataAndToast();
            }
        };

        const handleFocus = () => {
            isFocused = document.hasFocus();

            if (isFocused) {
                fetchDataAndToast();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleFocus);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleFocus);
            clearInterval(refreshInterval);
        };
    }, []);

    useEffect(() => {
        const updatePlayerLineChartData = () => {
            try {
                setPlayerLineChartData((prevChartData) => ({
                    ...prevChartData,
                    labels: [...prevChartData.labels, format(new Date(), 'HH:mm')],
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: [...prevChartData.datasets[0].data, servers.reduce((acc, server) => acc + server.Players, 0)],
                        },
                        {
                            ...prevChartData.datasets[1],
                            data: [...prevChartData.datasets[1].data, servers.reduce((acc, server) => acc + server.MaxPlayers, 0)],
                        },
                        {
                            ...prevChartData.datasets[2],
                            data: [...prevChartData.datasets[2].data, servers.reduce((acc, server) => acc + server.QueuePlayers, 0)],
                        }
                    ],
                }));
            } catch (e) {
                console.error("Error updating player line chart data: ", e);
            }
        };

        const updateServerLineChartData = () => {
            try {
                setServerLineChartData((prevChartData) => ({
                    ...prevChartData,
                    labels: [...prevChartData.labels, format(new Date(), 'HH:mm')],
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: [...prevChartData.datasets[0].data, servers.length],
                        },
                        {
                            ...prevChartData.datasets[1],
                            data: [...prevChartData.datasets[1].data, servers.filter(server => server.IsOfficial).length],
                        },
                        {
                            ...prevChartData.datasets[2],
                            data: [...prevChartData.datasets[2].data, servers.filter(server => !server.IsOfficial).length],
                        }
                    ],
                }));
            } catch (e) {
                console.error("Error updating server line chart data: ", e);
            }
        }

        updatePlayerLineChartData();
        updateServerLineChartData();
    }, [servers]);

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
    const onlineServers = servers.length;
    const maxPlayers = servers.reduce((acc, server) => acc + server.MaxPlayers, 0);
    const officialServers = servers.filter(server => server.IsOfficial).length;
    const communityServers = servers.filter(server => !server.IsOfficial).length;

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
                                <StatsCard>
                                    <div>
                                        <h4>
                                            <HiOutlineUserGroup/>
                                            Players
                                        </h4>
                                        <p>
                                            <strong>{playerCount}</strong>
                                        </p>
                                    </div>
                                    <div>
                                        <h4>
                                            <HiOutlineClock/>
                                            Queued Players
                                        </h4>
                                        <p>
                                            <strong>{queuedPlayers}</strong>
                                        </p>
                                    </div>
                                </StatsCard>
                                <StatsCard>
                                    <div>
                                        <h4>
                                            <HiOutlineServerStack/>
                                            Server Count
                                        </h4>
                                        <p>
                                            <strong>{onlineServers}</strong>
                                        </p>
                                    </div>
                                    <div>
                                        <h4>
                                            <HiOutlineUserCircle/>
                                            Server Capacity
                                        </h4>
                                        <p>
                                            <strong>{maxPlayers}</strong>
                                        </p>
                                    </div>
                                </StatsCard>
                                <StatsCard>
                                    <div>
                                        <h4>
                                            <AiOutlineCloudServer/>
                                            Official Servers
                                        </h4>
                                        <p>
                                            <strong>{officialServers}</strong>
                                        </p>
                                    </div>
                                    <div>
                                        <h4>
                                            <TbBuildingCommunity/>
                                            Community Servers
                                        </h4>
                                        <p>
                                            <strong>{communityServers}</strong>
                                        </p>
                                    </div>
                                </StatsCard>
                            </CardContainer>
                        </StatsContainer>
                        <StatsContainer>
                            <PieContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Game Mode Player Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={gameModePlayerPieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(gameModePlayerCount).map(([gamemode, count], index) => (
                                                <LegendItem key={gamemode}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{gamemode}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Gamemode Server Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={gameModeServersPieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(gameModeServerCount).map(([gamemode, count], index) => (
                                                <LegendItem key={gamemode}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{gamemode}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Region Player Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={regionPlayerPieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(regionPlayerCount).map(([region, count], index) => (
                                                <LegendItem key={region}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{region}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Region Server Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={regionServerPieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(regionServerCount).map(([region, count], index) => (
                                                <LegendItem key={region}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{region}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Map Player Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={mapPlayerPieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(mapPlayerCount).map(([map, count], index) => (
                                                <LegendItem key={map}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{map}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Map Server Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={mapServerPieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(mapServerCount).map(([map, count], index) => (
                                                <LegendItem key={map}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{map}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                                <StatsPieChartContainer>
                                    <StatChartTitle>Map Size Count</StatChartTitle>
                                    <StatsPieChart>
                                        <PieChartWrapper>
                                            <Pie data={mapSizePieData} options={pieOptions}/>
                                        </PieChartWrapper>
                                        <StatsPieChartLegend>
                                            {Object.entries(mapSizeServerCount).map(([mapSize, count], index) => (
                                                <LegendItem key={mapSize}>
                                                    <LegendColor color={colorMap[index % colorMap.length]}/>
                                                    <LegendText>
                                                        <span>{mapSize}: <strong>{count}</strong></span>
                                                    </LegendText>
                                                </LegendItem>
                                            ))}
                                        </StatsPieChartLegend>
                                    </StatsPieChart>
                                </StatsPieChartContainer>
                            </PieContainer>
                        </StatsContainer>
                        <StatsContainer>
                            <LineChartContainer>
                                <LineChartWrapper>
                                    <LineChartTitle>Player Count</LineChartTitle>
                                    <Line data={playerLineChartData} options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            },
                                            x: {
                                                display: true,
                                                title: {
                                                    display: true,
                                                    text: "Time (24hr)",
                                                }
                                            }
                                        }
                                    }}/>
                                </LineChartWrapper>
                                <LineChartWrapper>
                                    <LineChartTitle>Servers</LineChartTitle>
                                    <Line data={serverLineChartData} options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            },
                                            x: {
                                                display: true,
                                                title: {
                                                    display: true,
                                                    text: "Time (24hr)",
                                                }
                                            }
                                        }
                                    }}/>
                                </LineChartWrapper>
                            </LineChartContainer>
                        </StatsContainer>
                    </>
                )}
            </ContentWrapper>
        </>
    );
}

export default ServerStats;