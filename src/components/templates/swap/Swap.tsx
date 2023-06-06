// @ts-nocheck
import { getEllipsisTxt } from "@/utils/format";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Grid, Heading, HStack } from "@chakra-ui/layout";
import {
  Avatar,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  FormControl,
  ModalBody,
  FormLabel,
  Input,
  ButtonGroup,
  ModalFooter,
  Stack,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import {
  EvmAddressInput,
  EvmChain,
  EvmChainish,
} from "@moralisweb3/common-evm-utils";
import {
  useEvmWalletNFTCollections,
  useEvmWalletNFTs,
  useEvmWalletTokenBalances,
} from "@moralisweb3/next";
import { useSession } from "next-auth/react";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

export interface GetWalletNFTCollectionsRequest {
  chain: EvmChainish;
  address: EvmAddressInput;
}
//maybe add a pop-up so that the user can add the wallet he wants stuff from
const wallet: GetWalletNFTCollectionsRequest = {
  chain: EvmChain.ETHEREUM,
  address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
};

const Swap = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialRef = useRef(null);

  const [selectedRowsTokens, setSelectedRowsTokens] = useState<any[]>([]);
  const [selectedRowsNFTs, setSelectedRowsNFTs] = useState<any[]>([]);
  const [selectedRowsWantTokens, setSelectedRowsWantTokens] = useState<any[]>(
    []
  );
  const [selectedRowsWantNFTs, setSelectedRowsWantNFTs] = useState<any[]>([]);
  const [tokenValues, setTokenValues] = useState<
    { value: string; tokenAddress: string; tokenName: string }[]
  >([]);
  const [wantTokenValues, setWantTokenValues] = useState<
    { value: string; tokenAddress: string; tokenName: string }[]
  >([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [isClient, setIsClient] = useState(false);

  const { isConnected } = useAccount();
  const { data } = useSession();
  const { chain } = useNetwork();

  const hoverTrColor = useColorModeValue("gray.100", "gray.700");

  const { data: nfts } = useEvmWalletNFTs({
    //@ts-ignore
    address: data?.user?.address,
    chain: chain?.id,
  });
  const { data: tokenBalances } = useEvmWalletTokenBalances({
    //@ts-ignore
    address: data?.user?.address,
    chain: chain?.id,
  });
  const { data: newnfts } = useEvmWalletNFTs(wallet);

  useEffect(
    () => console.log("tokenBalances: ", tokenBalances),

    [tokenBalances]
  );
  useEffect(() => console.log("nfts: ", nfts), [nfts]);
  useEffect(() => console.log("newnfts: ", newnfts), [newnfts]);
  useEffect(
    () => console.log("selectedRowsWantTokens: ", selectedRowsWantTokens),
    [selectedRowsWantTokens]
  );
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleTokenChange = (
    index: number,
    value: string,
    tokenAddress: string,
    tokenName: string
  ) => {
    const newTokenValues = [...tokenValues];
    newTokenValues[index] = {
      value: value,
      tokenAddress: tokenAddress,
      tokenName: tokenName,
    };
    setTokenValues(newTokenValues);
  };

  const handleWantTokenChange = (
    index: number,
    value: string,
    tokenAddress: string,
    tokenName: string
  ) => {
    const newWantTokenValues = [...wantTokenValues];
    newWantTokenValues[index] = {
      value: value,
      tokenAddress: tokenAddress,
      tokenName: tokenName,
    };
    setWantTokenValues(newWantTokenValues);
  };

  const handleWalletAddressChange = (event: string) => {
    setWalletAddress(event);
  };

  const handleMintContract = () => {
    if (walletAddress === "" || undefined || null) {
      toast({
        title: "error please enter wallet address",
        status: "error",
        isClosable: true,
      });
    } else {
      handleOnClose();
      console.log(
        tokenValues,
        wantTokenValues,
        selectedRowsNFTs,
        selectedRowsWantNFTs,
        walletAddress
      );
    }
  };
  if (!isClient) {
    return null; // Render nothing on the server-side
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleOnClose}
        initialFocusRef={initialRef}
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={"bold"}>Contract :</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl paddingBottom={"8"}>
              <FormLabel>Number of tokens you want to give:</FormLabel>
              {selectedRowsTokens?.map(({ tokenName, tokenAddress }, index) => (
                <>
                  <FormLabel fontSize={"sm"} textColor={"cadetblue"}>
                    {tokenName}
                  </FormLabel>
                  <Input
                    autoFocus
                    placeholder={tokenValues[index]?.value}
                    value={tokenValues[index]?.value}
                    onChange={(event) =>
                      handleTokenChange(
                        index,
                        event.target.value,
                        tokenAddress,
                        tokenName
                      )
                    }
                  />
                </>
              ))}
            </FormControl>
            <FormControl>
              <FormLabel>Number of tokens you want to receive:</FormLabel>
              {selectedRowsWantTokens?.map(
                ({ tokenName, tokenAddress }, index) => (
                  <>
                    <FormLabel
                      fontSize={"sm"}
                      textColor={"cadetblue"}
                      paddingTop={"2"}
                    >
                      {tokenName}
                    </FormLabel>
                    <Input
                      autoFocus
                      placeholder={wantTokenValues[index]?.value}
                      value={wantTokenValues[index]?.value}
                      onChange={(event) =>
                        handleWantTokenChange(
                          index,
                          event.target.value,
                          tokenAddress,
                          tokenName
                        )
                      }
                    />
                  </>
                )
              )}
            </FormControl>

            <FormControl mt={6}>
              <FormLabel>NFTs you want to give:</FormLabel>
              {selectedRowsNFTs?.map(({ name, metadata }, key) => (
                <>
                  <FormLabel fontSize={"sm"} textColor={"cadetblue"}>
                    {name}
                  </FormLabel>
                </>
              ))}
            </FormControl>

            <FormControl mt={6}>
              <FormLabel>NFTs you want :</FormLabel>
              {selectedRowsWantNFTs?.map(({ name, metadata }, key) => (
                <>
                  <FormLabel fontSize={"sm"} textColor={"cadetblue"}>
                    {name}
                  </FormLabel>
                </>
              ))}
            </FormControl>
            <FormControl mt={6} isRequired>
              <FormLabel>Wallet address of reciever:</FormLabel>
              <Input
                placeholder="0x6f43....40a3e"
                value={walletAddress}
                onChange={(event) =>
                  handleWalletAddressChange(event.target.value)
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button colorScheme="blue" mr={3} onClick={handleMintContract}>
                Mint Contract
              </Button>
              <Button onClick={handleOnClose}>Cancel</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack>
        <Heading size="lg" marginBottom={6}>
          CREATE SWAP
        </Heading>
        <HStack>
          <Box
            border="2px"
            borderColor={hoverTrColor}
            borderRadius="xl"
            w="xl"
            h="lg"
            padding="24px 18px"
            margin="5"
          >
            <Heading textAlign="center">Have</Heading>
            {isConnected ? (
              <Box height="80%" overflow="auto" width={"full"}>
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>ERC20 assets you hold</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Token</Th>
                        <Th>Value</Th>
                        <Th isNumeric>Address</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tokenBalances?.map(({ token, value }, key) => (
                        <Tr
                          key={`${token?.symbol}-${key}-tr`}
                          _hover={{ bgColor: hoverTrColor }}
                          cursor="pointer"
                          onClick={(e) => {
                            const rowInfo = {
                              tokenName: token?.name,
                              tokenAddress: token?.contractAddress.checksum,
                            };
                            if (
                              selectedRowsTokens.some(
                                (row) => row.tokenName === rowInfo.tokenName
                              )
                            ) {
                              setSelectedRowsTokens(
                                selectedRowsTokens.filter(
                                  (row) => row.tokenName !== rowInfo.tokenName
                                )
                              );
                            } else {
                              setSelectedRowsTokens([
                                ...selectedRowsTokens,
                                rowInfo,
                              ]);
                            }
                          }}
                          bgColor={
                            selectedRowsTokens.some(
                              (row) => row.tokenName === token?.name
                            )
                              ? hoverTrColor
                              : ""
                          }
                          border={
                            selectedRowsTokens.some(
                              (row) => row.tokenName === token?.name
                            )
                              ? "2px"
                              : "none"
                          }
                          borderColor={
                            selectedRowsTokens.some(
                              (row) => row.tokenName === token?.name
                            )
                              ? "blue.500"
                              : ""
                          }
                        >
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                src={token?.logo || ""}
                                name={token?.name}
                              />
                              <VStack alignItems={"flex-start"}>
                                <Text as={"span"}>{token?.name}</Text>
                                <Text fontSize={"xs"} as={"span"}>
                                  {token?.symbol}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>{Number(value).toFixed(2)}</Td>
                          <Td isNumeric>
                            {getEllipsisTxt(token?.contractAddress.checksum)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Token</Th>
                        <Th>Value</Th>
                        <Th isNumeric>Address</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>NFT assets you hold</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Token</Th>
                        <Th>Value</Th>
                        <Th isNumeric>Address</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {nfts?.map(
                        (
                          {
                            amount,
                            name,
                            tokenUri,
                            symbol,
                            tokenAddress,
                            metadata,
                          },
                          key
                        ) => (
                          <Tr
                            key={`${symbol}-${key}-tr`}
                            _hover={{ bgColor: hoverTrColor }}
                            cursor="pointer"
                            onClick={(e) => {
                              const rowInfo = {
                                name: name,
                                tokenAddress: getEllipsisTxt(
                                  tokenAddress?._value
                                ),
                                amount: amount,
                                symbol: symbol,
                                metadata: metadata,
                              };

                              if (
                                selectedRowsNFTs.some((row) => {
                                  return (
                                    row.symbol === rowInfo.symbol &&
                                    row.metadata?.name ===
                                      // @ts-ignore
                                      rowInfo?.metadata?.name
                                  );
                                })
                              ) {
                                setSelectedRowsNFTs(
                                  selectedRowsNFTs.filter(
                                    (row) =>
                                      row.symbol !== rowInfo.symbol &&
                                      row.metadata?.name !==
                                        // @ts-ignore
                                        rowInfo?.metadata?.name
                                  )
                                );
                              } else {
                                setSelectedRowsNFTs([
                                  ...selectedRowsNFTs,
                                  rowInfo,
                                ]);
                              }
                            }}
                            bgColor={
                              selectedRowsNFTs.some(
                                (row) =>
                                  row.symbol === symbol &&
                                  // @ts-ignore
                                  row.metadata?.name === metadata?.name
                              )
                                ? hoverTrColor
                                : ""
                            }
                            border={
                              selectedRowsNFTs.some(
                                (row) =>
                                  row.symbol === symbol &&
                                  // @ts-ignore
                                  row.metadata?.name === metadata?.name
                              )
                                ? "2px"
                                : "none"
                            }
                            borderColor={
                              selectedRowsNFTs.some(
                                (row) =>
                                  row.symbol === symbol &&
                                  // @ts-ignore
                                  row.metadata?.name === metadata?.name
                              )
                                ? "blue.500"
                                : ""
                            }
                          >
                            <Td>
                              <HStack>
                                <Avatar
                                  size="sm"
                                  // @ts-ignore
                                  src={metadata?.image || ""}
                                  name={name}
                                />
                                <VStack alignItems={"flex-start"}>
                                  <Text as={"span"}>{name}</Text>
                                  <Text fontSize={"xs"} as={"span"}>
                                    {symbol}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td>{Number(amount).toFixed(2)}</Td>
                            <Td isNumeric>
                              {getEllipsisTxt(tokenAddress?._value)}
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Token</Th>
                        <Th>Value</Th>
                        <Th isNumeric>Address</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box textAlign={"center"} margin={10}>
                Looks like you do not have any tokens
              </Box>
            )}
          </Box>
          <Box
            border="2px"
            borderColor={hoverTrColor}
            borderRadius="xl"
            w="xl"
            h="lg"
            padding="24px 18px"
            margin="5"
          >
            <Heading textAlign="center">Want</Heading>
            <Box height="80%" overflow="auto" width={"full"}>
              <TableContainer>
                <Table variant="simple">
                  <TableCaption>Assets you want</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Token</Th>
                      <Th isNumeric>Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr
                      key={`USDT-1-tr`}
                      _hover={{ bgColor: hoverTrColor }}
                      cursor="pointer"
                      onClick={(e) => {
                        const rowInfo = {
                          tokenName: "USDT",
                          tokenAddress:
                            "0xDdF73887D6E1E15cC826bf55F273DD8F7d7490Cf",
                        };
                        if (
                          selectedRowsWantTokens.some(
                            (row) => row.tokenName === rowInfo.tokenName
                          )
                        ) {
                          setSelectedRowsWantTokens(
                            selectedRowsWantTokens.filter(
                              (row) => row.tokenName !== rowInfo.tokenName
                            )
                          );
                        } else {
                          setSelectedRowsWantTokens([
                            ...selectedRowsWantTokens,
                            rowInfo,
                          ]);
                        }
                      }}
                      bgColor={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "USDT"
                        )
                          ? hoverTrColor
                          : ""
                      }
                      border={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "USDT"
                        )
                          ? "2px"
                          : "none"
                      }
                      borderColor={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "USDT"
                        )
                          ? "blue.500"
                          : ""
                      }
                    >
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            src="https://etherscan.io/token/images/tethernew_32.png"
                            name="USDT"
                          />
                          <VStack alignItems={"flex-start"}>
                            <Text as={"span"}>USDT</Text>
                            <Text fontSize={"xs"} as={"span"}>
                              USDT
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td isNumeric>
                        0xDdF73887D6E1E15cC826bf55F273DD8F7d7490Cf
                      </Td>
                    </Tr>
                    <Tr
                      key={`USDC-2-tr`}
                      _hover={{ bgColor: hoverTrColor }}
                      cursor="pointer"
                      onClick={(e) => {
                        const rowInfo = {
                          tokenName: "USDC",
                          tokenAddress:
                            "0x51fCe89b9f6D4c530698f181167043e1bB4abf89",
                        };
                        if (
                          selectedRowsWantTokens.some(
                            (row) => row.tokenName === rowInfo.tokenName
                          )
                        ) {
                          setSelectedRowsWantTokens(
                            selectedRowsWantTokens.filter(
                              (row) => row.tokenName !== rowInfo.tokenName
                            )
                          );
                        } else {
                          setSelectedRowsWantTokens([
                            ...selectedRowsWantTokens,
                            rowInfo,
                          ]);
                        }
                      }}
                      bgColor={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "USDC"
                        )
                          ? hoverTrColor
                          : ""
                      }
                      border={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "USDC"
                        )
                          ? "2px"
                          : "none"
                      }
                      borderColor={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "USDC"
                        )
                          ? "blue.500"
                          : ""
                      }
                    >
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            src="	https://etherscan.io/token/images/centre-usdc_28.png"
                            name="USDC"
                          />
                          <VStack alignItems={"flex-start"}>
                            <Text as={"span"}>USDC</Text>
                            <Text fontSize={"xs"} as={"span"}>
                              USDC
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td isNumeric>
                        0x51fCe89b9f6D4c530698f181167043e1bB4abf89
                      </Td>
                    </Tr>
                    <Tr
                      key={`BUSD-BUSD-tr`}
                      _hover={{ bgColor: hoverTrColor }}
                      cursor="pointer"
                      onClick={(e) => {
                        const rowInfo = {
                          tokenName: "BUSD",
                          tokenAddress:
                            "0x1a9fA3A74590AC1af1bB0Bc8e021Ef91aBF1A4C5",
                        };
                        if (
                          selectedRowsWantTokens.some(
                            (row) => row.tokenName === rowInfo.tokenName
                          )
                        ) {
                          setSelectedRowsWantTokens(
                            selectedRowsWantTokens.filter(
                              (row) => row.tokenName !== rowInfo.tokenName
                            )
                          );
                        } else {
                          setSelectedRowsWantTokens([
                            ...selectedRowsWantTokens,
                            rowInfo,
                          ]);
                        }
                      }}
                      bgColor={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "BUSD"
                        )
                          ? hoverTrColor
                          : ""
                      }
                      border={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "BUSD"
                        )
                          ? "2px"
                          : "none"
                      }
                      borderColor={
                        selectedRowsWantTokens.some(
                          (row) => row.tokenName === "BUSD"
                        )
                          ? "blue.500"
                          : ""
                      }
                    >
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            src="	https://etherscan.io/token/images/binanceusd_32.png"
                            name="BUSD"
                          />
                          <VStack alignItems={"flex-start"}>
                            <Text as={"span"}>BUSD</Text>
                            <Text fontSize={"xs"} as={"span"}>
                              BUSD
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td isNumeric>
                        0x1a9fA3A74590AC1af1bB0Bc8e021Ef91aBF1A4C5
                      </Td>
                    </Tr>
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>Token</Th>
                      <Th isNumeric>Address</Th>
                    </Tr>
                  </Tfoot>
                </Table>
                <Table variant="simple">
                  <TableCaption>NFT assets you hold</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Token</Th>
                      <Th>Value</Th>
                      <Th isNumeric>Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {newnfts?.map(
                      (
                        {
                          amount,
                          name,
                          tokenUri,
                          symbol,
                          tokenAddress,
                          metadata,
                        },
                        key
                      ) => (
                        <Tr
                          key={`${symbol}-${key}-tr`}
                          _hover={{ bgColor: hoverTrColor }}
                          cursor="pointer"
                          onClick={(e) => {
                            const rowInfo = {
                              name: name,
                              tokenAddress: getEllipsisTxt(
                                tokenAddress?._value
                              ),
                              amount: amount,
                              symbol: symbol,
                              metadata: metadata,
                            };

                            if (
                              selectedRowsWantNFTs.some(
                                (row) =>
                                  row.symbol === rowInfo.symbol &&
                                  // @ts-ignore
                                  row.metadata?.name === rowInfo?.metadata?.name
                              )
                            ) {
                              setSelectedRowsWantNFTs(
                                selectedRowsWantNFTs.filter(
                                  (row) =>
                                    row.symbol !== rowInfo.symbol &&
                                    row.metadata?.name !==
                                      // @ts-ignore
                                      rowInfo?.metadata?.name
                                )
                              );
                            } else {
                              setSelectedRowsWantNFTs([
                                ...selectedRowsWantNFTs,
                                rowInfo,
                              ]);
                            }
                          }}
                          bgColor={
                            selectedRowsWantNFTs.some(
                              (row) =>
                                row.symbol === symbol &&
                                // @ts-ignore
                                row.metadata?.name === metadata?.name
                            )
                              ? hoverTrColor
                              : ""
                          }
                          border={
                            selectedRowsWantNFTs.some(
                              (row) =>
                                row.symbol === symbol &&
                                // @ts-ignore
                                row.metadata?.name === metadata?.name
                            )
                              ? "2px"
                              : "none"
                          }
                          borderColor={
                            selectedRowsWantNFTs.some(
                              (row) =>
                                row.symbol === symbol &&
                                // @ts-ignore
                                row.metadata?.name === metadata?.name
                            )
                              ? "blue.500"
                              : ""
                          }
                        >
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                // @ts-ignore
                                src={metadata?.image || ""}
                                name={name}
                              />
                              <VStack alignItems={"flex-start"}>
                                <Text as={"span"}>{name}</Text>
                                <Text fontSize={"xs"} as={"span"}>
                                  {symbol}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>{Number(amount).toFixed(2)}</Td>
                          <Td isNumeric>
                            {getEllipsisTxt(tokenAddress?._value)}
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>Token</Th>
                      <Th>Value</Th>
                      <Th isNumeric>Address</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </HStack>
        <Button
          rightIcon={<ArrowForwardIcon />}
          colorScheme="teal"
          variant="outline"
          onClick={onOpen}
          disabled={!isConnected}
        >
          Next
        </Button>
      </VStack>
    </>
  );
};

export default Swap;
