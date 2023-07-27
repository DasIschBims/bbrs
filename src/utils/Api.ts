import {Client} from "bbr-api";

const bbrApiClient : Client = new Client({
    customUserAgent: true
});

export default bbrApiClient ;