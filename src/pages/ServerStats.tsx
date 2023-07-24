import {Sidebar} from "../components/Sidebar.tsx";
import {ContentWrapper} from "../styles/PageContent.ts";
import {Server} from "bbr-api";
import {useEffect, useState} from "react";
import bbrApiClient from "../Api.ts";
import {Chart, ArcElement} from 'chart.js'
import {
    StatsCardLong,
    StatsContainer,
    StatsPieChart,
    StatsPieChartContainer,
    StatsPieChartLegend
} from "../styles/StatComponents.ts";
import {HiOutlineUserGroup} from "react-icons/hi2";
import {Pie} from "react-chartjs-2";
import {HiOutlineClock} from "react-icons/hi";

Chart.register(ArcElement);

const gameModeColorMap: Record<string, string> = {
    "CONQ": "rgba(255, 99, 132, 1)",
    "18": "rgba(54, 162, 235, 1)", // ctf
    "TDM": "rgba(255, 206, 86, 1)",
    "DOMI": "rgba(75, 192, 192, 1)",
    "FRONTLINE": "rgba(153, 102, 255, 1)",
    "RUSH": "rgba(255, 159, 64, 1)",
}

function ServerStats() {
    const [servers, setServers] = useState<Server[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchData();

        let intervalId: number | null = null;
        if (autoRefresh) {
            intervalId = setInterval(fetchData, 10000); // 10 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [autoRefresh]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await bbrApiClient.getServerList();
            setServers(response.servers);
            setLoading(false);
            setError(false);
        } catch (e) {
            console.error("Error fetching servers: ", e);
            setLoading(false);
            setError(true);
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

    const gameModePieData = {
        labels: Object.keys(gameModePlayerCount),
        datasets: [
            {
                label: 'Gamemode Counts',
                data: Object.values(gameModePlayerCount),
                backgroundColor: [
                    ...Object.keys(gameModePlayerCount).map((gamemode) => gameModeColorMap[gamemode]),
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <>
            <Sidebar/>
            <ContentWrapper>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error fetching servers</p>
                ) : (
                    <>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={() => setAutoRefresh(!autoRefresh)}
                        />
                        <label>Auto Refresh (10 seconds)</label>
                        <StatsContainer>
                            <StatsCardLong>
                                <div>
                                    <h3>
                                        <HiOutlineUserGroup/>
                                        Player Count
                                    </h3>
                                    <p>
                                        <strong>{playerCount}</strong>
                                    </p>
                                </div>
                                <div>
                                    <h3>
                                        <HiOutlineClock/>
                                        Queued Players
                                    </h3>
                                    <p>
                                        <strong>{queuedPlayers}</strong>
                                    </p>
                                </div>
                            </StatsCardLong>
                            <StatsPieChartContainer>
                                <StatsPieChart>
                                    <h3>Gamemode Player Count</h3>
                                    <Pie data={gameModePieData}/>
                                    <StatsPieChartLegend>
                                        {Object.entries(gameModePlayerCount).map(([gamemode, count]) => (
                                            <div key={gamemode}
                                                 style={
                                                     {
                                                         display: "flex",
                                                         alignItems: "center",
                                                         justifyContent: "center",
                                                     }
                                                 }
                                            >
                                                <span
                                                    style={
                                                        {
                                                            backgroundColor: gameModeColorMap[gamemode],
                                                            width: "20px",
                                                            height: "20px",
                                                            display: "inline-block",
                                                            marginRight: "10px",
                                                        }
                                                    }
                                                />
                                                <p
                                                    style={
                                                        {
                                                            display: "inline-block",
                                                            margin: 0,
                                                        }
                                                    }
                                                >
                                                    {gamemode}: <strong>{count}</strong>
                                                </p>
                                            </div>
                                        ))}
                                    </StatsPieChartLegend>
                                </StatsPieChart>
                            </StatsPieChartContainer>
                        </StatsContainer>
                    </>
                )}
            </ContentWrapper>
        </>
    );
}

export default ServerStats;