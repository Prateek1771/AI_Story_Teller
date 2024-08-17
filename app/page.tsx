import Image from "next/image";
import boy from "@/Images/boy.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="bg-zinc-900 flex-1 flex flex-col">
      
      <hr className="bg-zinc-800"/>

      <section className="mt-3 flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-purple-500 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-10">
          
          <Image src={boy} height={250} alt='Logo'/>

          <Button asChild className="px-20 bg-purple-700 p-10 text-xl">
            <Link href='/stories'>Explore Story Library</Link>
          </Button>
        </div>

        <StoryWriter />
      </section>
    </main>
  );
}
