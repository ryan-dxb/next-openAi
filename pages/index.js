import Link from "next/link";
import Logo from "../components/Logo/Logo";

const Home = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden ">
      <div className="relative z-10 max-w-screen-sm rounded-md bg-slate-900/70 px-10 py-5 text-center text-white backdrop-blur-sm">
        <Logo />
        <p className="pb-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis quam
          corporis accusantium repellat dicta dolore at voluptates inventore
          sed. Debitis, dolor? Repudiandae quasi ex adipisci eos tempore in odit
          eum?
        </p>
        <Link href="/post/new" className="green-button">
          {" "}
          Begin writing
        </Link>
      </div>
    </div>
  );
};

export default Home;
