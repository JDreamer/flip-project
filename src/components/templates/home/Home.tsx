import { CheckCircleIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Heading,
  VStack,
  List,
  ListIcon,
  ListItem,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  return (
    <VStack w={"full"} spacing={12}>
      <Heading size="md">FLIP</Heading>
      <List spacing={5}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Display Transactions
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Display ERC20 transfers
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Display ERC20 balances
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Display NFT balances
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Display NFT transfers
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Create 0 fee swaps
        </ListItem>
        <ListItem>
          <ListIcon as={SettingsIcon} color="green.500" />
          Create the trade that suits you
        </ListItem>
      </List>
      <Button
        colorScheme="teal"
        variant="solid"
        bgColor="green.500"
        textColor="white"
        onClick={() => {
          router.push("/swap");
        }}
      >
        CREATE SWAP
      </Button>
    </VStack>
  );
};

export default Home;
