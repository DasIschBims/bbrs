import {Sidebar} from "../components/Sidebar.tsx";
import {ContentWrapper} from "../styles/PageContent.ts";
import {Server} from "bbr-api";
import {useEffect, useState} from "react";
import bbrApiClient from "../utils/Api.ts";
import {Chart, ArcElement} from 'chart.js'
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

Chart.register(ArcElement);

const gameModeColorMap: Record<string, string> = {
    "CONQ": "rgba(255, 99, 132, 1)",
    "18": "rgba(54, 162, 235, 1)", // This is actually CTI, but the API returns 18 for some reason
    "TDM": "rgba(255, 206, 86, 1)",
    "DOMI": "rgba(75, 192, 192, 1)",
    "FRONTLINE": "rgba(153, 102, 255, 1)",
    "RUSH": "rgba(255, 159, 64, 1)",
    "INFCONQ": "rgba(153, 206, 86, 1)",
}

const regionColorMap: Record<string, string> = {
    "America_Central": "rgba(255, 99, 132, 1)",
    "Europe_Central": "rgba(54, 162, 235, 1)",
    "Brazil_Central": "rgba(255, 206, 86, 1)",
    "Japan_Central": "rgba(75, 192, 192, 1)",
    "Australia_Central": "rgba(153, 102, 255, 1)",
}

const mapColorMap: Record<string, string> = {
    "Azagor": "rgba(211, 67, 79, 1)",
    "District": "rgba(254, 164, 60, 1)",
    "Wakistan": "rgba(44, 127, 184, 1)",
    "Namak": "rgba(89, 169, 79, 1)",
    "Salhan": "rgba(140, 86, 75, 1)",
    "MultuIslands": "rgba(207, 125, 128, 1)",
    "SandySunset": "rgba(107, 70, 99, 1)",
    "Eduardovo": "rgba(108, 112, 146, 1)",
    "Dustydew": "rgba(214, 39, 40, 1)",
    "Polygon": "rgba(255, 152, 150, 1)",
    "WineParadise": "rgba(44, 160, 44, 1)",
    "Lonovo": "rgba(148, 103, 189, 1)",
    "Construction": "rgba(140, 86, 75, 1)",
    "OilDunes": "rgba(255, 187, 120, 1)",
    "Basra": "rgba(180, 180, 180, 1)",
    "River": "rgba(188, 189, 34, 1)",
    "Valley": "rgba(23, 190, 207, 1)",
    "Frugis": "rgba(127, 127, 127, 1)",
    "Isle": "rgba(188, 189, 34, 1)",
    "TensaTown": "rgba(23, 190, 207, 1)",
};

const mapSizeColorMap: Record<string, string> = {
    "Ultra": "rgba(255, 99, 132, 1)",
    "Medium": "rgba(54, 162, 235, 1)",
    "Big": "rgba(255, 206, 86, 1)",
    "Small": "rgba(75, 192, 192, 1)",
};

const createPieData = (label: string, data: Record<string, number>, colorMap: Record<string, string>) => ({
    labels: Object.keys(data),
    datasets: [
        {
            label: label,
            data: Object.values(data),
            backgroundColor: [
                ...Object.keys(data).map((gamemode) => colorMap[gamemode]),
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
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

    console.log(mapSizeServerCount)

    const gameModePlayerPieData = createPieData("Game Mode Player Count", gameModePlayerCount, gameModeColorMap)
    const gameModeServersPieData = createPieData("Game Mode Server Count", gameModeServerCount, gameModeColorMap)
    const regionPlayerPieData = createPieData("Region Player Count", regionPlayerCount, regionColorMap)
    const regionServerPieData = createPieData("Region Server Count", regionServerCount, regionColorMap)
    const mapPlayerPieData = createPieData("Map Player Count", mapPlayerCount, mapColorMap)
    const mapServerPieData = createPieData("Map Server Count", mapServerCount, mapColorMap)
    const mapSizePieData = createPieData("Map Size Count", mapSizeServerCount, mapSizeColorMap)

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
                                            {Object.entries(gameModePlayerCount).map(([gamemode, count]) => (
                                                <LegendItem key={gamemode}>
                                                    <LegendColor color={gameModeColorMap[gamemode]}/>
                                                    <LegendText>
                                                        {gamemode}: <strong>{count}</strong>
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
                                            {Object.entries(gameModeServerCount).map(([gamemode, count]) => (
                                                <LegendItem key={gamemode}>
                                                    <LegendColor color={gameModeColorMap[gamemode]}/>
                                                    <LegendText>
                                                        {gamemode}: <strong>{count}</strong>
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
                                            {Object.entries(regionPlayerCount).map(([region, count]) => (
                                                <LegendItem key={region}>
                                                    <LegendColor color={regionColorMap[region]}/>
                                                    <LegendText>
                                                        {region}: <strong>{count}</strong>
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
                                            {Object.entries(regionServerCount).map(([region, count]) => (
                                                <LegendItem key={region}>
                                                    <LegendColor color={regionColorMap[region]}/>
                                                    <LegendText>
                                                        {region}: <strong>{count}</strong>
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
                                            {Object.entries(mapPlayerCount).map(([map, count]) => (
                                                <LegendItem key={map}>
                                                    <LegendColor color={mapColorMap[map]}/>
                                                    <LegendText>
                                                        {map}: <strong>{count}</strong>
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
                                            {Object.entries(mapServerCount).map(([map, count]) => (
                                                <LegendItem key={map}>
                                                    <LegendColor color={mapColorMap[map]}/>
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
                                            {Object.entries(mapSizeServerCount).map(([mapSize, count]) => (
                                                <LegendItem key={mapSize}>
                                                    <LegendColor color={mapSizeColorMap[mapSize]}/>
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