import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo = () => {
  return (
    <div className="py-4 text-center font-heading text-3xl">
      <span className="mr-2">Blog OpenAI</span>
      <FontAwesomeIcon icon={faBrain} className=" text-2xl text-slate-400" />
    </div>
  );
};

export default Logo;
