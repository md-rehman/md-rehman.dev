import type { NextPage } from "next";
import { ColorWave } from "../../components/compounds/canvas/ColorWave";
import { Uploader } from "../../components/channels/videoMaker/Uploader";

const VideoMaker: NextPage = () => {
	return <Uploader />;
};

export default VideoMaker;
