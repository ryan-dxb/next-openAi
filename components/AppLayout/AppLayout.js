import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Logo from "../Logo/Logo";

const AppLayout = ({ children, availableTokens, posts, postId }) => {
  const { user, error, isLoading } = useUser();

  return (
    <div className="grid h-screen max-h-screen grid-cols-[300px_1fr]">
      <div className="flex flex-col overflow-hidden text-white">
        <div className="bg-slate-800 px-2">
          <div>
            <Logo />
          </div>
          <Link href="/post/new" className="green-button ">
            New Post
          </Link>
          <Link href="/token-topup" className="mt-2 block text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />{" "}
            <span className="pl-1">{availableTokens} Tokens Available</span>
          </Link>
        </div>
        <div className=" flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800 px-4">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={` my-2 block cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-sm border border-black/0 bg-white/10 ${
                postId === post._id && "border-white/100 bg-white/20"
              }
                px-3`}
            >
              {post.postTopic}
            </Link>
          ))}
        </div>
        <div className="flex h-20 items-center gap-4 border-t border-t-black/70 bg-cyan-800 px-2">
          {user ? (
            <>
              <div className="min-w-[50px] ">
                <Image
                  className="rounded-full"
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
