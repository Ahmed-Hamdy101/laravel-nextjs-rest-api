import Image from "next/image";
import Login from "@/components/auth/Login";

export default function Home() {
  return (
    <div className="flex flex-col  items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <Login/>
    </div>
  );
}
