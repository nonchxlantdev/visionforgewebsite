import { ConnectedSystem } from "@/components/sections/ConnectedSystem";
import { Furnace } from "@/components/sections/Furnace";
import { Hallmarks } from "@/components/sections/Hallmarks";
import { Process } from "@/components/sections/Process";
import { Quench } from "@/components/sections/Quench";
import { RawMaterials } from "@/components/sections/RawMaterials";
import { Strike } from "@/components/sections/Strike";

export default function Home() {
  return (
    <>
      <Furnace />
      <RawMaterials />
      <Strike />
      <Process />
      <ConnectedSystem />
      <Hallmarks />
      <Quench />
    </>
  );
}
