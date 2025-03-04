import { LOGO_LINK } from "../../constants/constants";

const MapLogo: React.FC = () => {
  return (
    <div className="absolute w-1/5 h-auto bottom-[20vh] right-[1vw] flex flex-col items-end">
      <img src={LOGO_LINK} alt="Logo" className="w-full h-full" />
    </div>
  );
};

export default MapLogo;