import {useState} from "react";
import {SideBarClosed, SideBarContainer, SideBarContent, SideBarLogo, SideBarOpened} from "../styles/SideBarStyles.ts";
import {NavLink} from "react-router-dom";
import {ImArrowLeft2, ImArrowRight2, ImHome, ImList2, ImStatsBars} from "react-icons/im";
import logo from "../assets/lenny.png";

export function Sidebar() {
    const [sidebar, setSidebar] = useState(false);

    function handleSidebar() {
        setSidebar((prevState) => !prevState);
    }

    return (
        <SideBarContainer>
            <SideBarContent>
                {!sidebar ? (
                    <SideBarClosed>
                        <nav>
                            <button onClick={handleSidebar}>
                                <ImArrowRight2/>
                            </button>
                            <SideBarLogo>
                                <img src={logo} alt={"Lenny"}/>
                            </SideBarLogo>
                            <ul>
                                <NavLink
                                    to={"/"}
                                    title={"Home"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                >
                                    <ImHome/>
                                </NavLink>
                                <NavLink
                                    to={"/stats"}
                                    title={"Stats"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                >
                                    <ImStatsBars/>
                                </NavLink>
                                <NavLink
                                    to={"/list"}
                                    title={"List"}
                                    className={({isActive}) => isActive ? "active" : ""}
                                >
                                    <ImList2/>
                                </NavLink>
                            </ul>
                        </nav>
                    </SideBarClosed>
                ) : (
                    <SideBarOpened>
                        <section>
                            <span>
                                <button onClick={handleSidebar}>
                                    <ImArrowLeft2/>
                                </button>
                            </span>
                            <SideBarLogo>
                                <img src={logo} alt={"Lenny"}/>
                            </SideBarLogo>
                            <nav>
                                <ul>
                                    <NavLink
                                        to={"/"}
                                        className={({isActive}) => isActive ? "active" : ""}
                                    >
                                        <ImHome/>
                                        <p>Home</p>
                                    </NavLink>
                                    <NavLink
                                        to={"/stats"}
                                        className={({isActive}) => isActive ? "active" : ""}
                                    >
                                        <ImStatsBars/>
                                        <p>Server Stats</p>
                                    </NavLink>
                                    <NavLink
                                        to={"/list"}
                                        className={({isActive}) => isActive ? "active" : ""}
                                    >
                                        <ImList2/>
                                        <p>Server List</p>
                                    </NavLink>
                                </ul>
                            </nav>
                        </section>
                        <aside onClick={handleSidebar}/>
                    </SideBarOpened>
                )}
            </SideBarContent>
        </SideBarContainer>
    )
}