import { useColorMode } from "@chakra-ui/react";
import Image from "next/image";

const MoralisLogo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === "dark" ? "/flip-light.svg" : "/flip-dark.svg"}
      height={45}
      width={150}
      alt="Flip"
    />
  );
};

export default MoralisLogo;
