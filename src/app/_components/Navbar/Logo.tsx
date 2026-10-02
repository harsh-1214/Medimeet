import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <div>
      <Link className="rounded-full p-6" href={'/'}>
        <Image src={"/my-logo.jpeg"} width={60} height={60} alt="logo" />
      </Link>
      {/* <div>MediMeet</div> */}
    </div>
  );
};