import {Sidebar} from "../components/Sidebar.tsx";
import {ContentWrapper} from "../styles/PageContent.ts";

function FrontPage() {
    return (
        <div>
            <Sidebar/>
            <ContentWrapper style={
                {
                    textAlign: "center",
                }
            }>
                <h1>Welcome!</h1>
                <p>
                    This is a pretty work-in-progress website for viewing the current status of the official servers for
                    BattleBit Remastered.<br/>Please expect a lot of bugs, missing features, and other issues.<br/>If
                    you have
                    any feedback, please let me know on Discord at <a href="https://discord.gg/ZURcscg" style={
                        {
                            color: "var(--primary)",
                            textDecoration: "underline",
                            fontWeight: "bold"
                        }
                    }>
                        @dasischbims
                    </a> or on any of my socials linked over in my <a href="https://github.com/DasIschBims/" style={
                        {
                            color: "var(--primary)",
                            textDecoration: "underline",
                            fontWeight: "bold"
                        }
                    }>
                        GitHub profile
                    </a>.
                </p>
            </ContentWrapper>
        </div>
    )
}

export default FrontPage