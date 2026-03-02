
import Posts from "./Posts";
import CreatePost from "../Components/shared/CreatePost";

export default function Home() {

  return (
    <>
      <div className="flex py-8 items-center flex-col min-h-screen bg-violet-100">
        <CreatePost />
        <Posts />
      </div>
    </>
  );
}
