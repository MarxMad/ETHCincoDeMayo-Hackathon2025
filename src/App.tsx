import { 
  ChakraProvider, 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Grid, 
  GridItem, 
  Flex, 
  Icon, 
  extendTheme,
  CSSReset,
  theme as baseTheme,
  Button,
  useColorModeValue,
  Image,
  Spacer,
} from '@chakra-ui/react'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { FaGraduationCap, FaUtensils, FaUniversity, FaRobot, FaComment } from 'react-icons/fa'
import { useState } from 'react'
import ScholarshipManager from './components/ScholarshipManager'
import CafeteriaSpending from './components/CafeteriaSpending'
import AIChat from './components/AIChat'
import WelcomeScreen from './components/WelcomeScreen'
import ClaimScholarship from './components/ClaimScholarship'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const theme = extendTheme({
  ...baseTheme,
  colors: {
    brand: {
      50: '#FFF9E6',
      100: '#FFEECC',
      200: '#FFE3B3',
      300: '#FFD899',
      400: '#FFCD80',
      500: '#FFC266',
      600: '#FFB74D',
      700: '#FFAC33',
      800: '#FFA11A',
      900: '#FF9600',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props: { colorScheme: string }) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
            transform: 'translateY(0)',
          },
        }),
      },
    },
    Box: {
      baseStyle: {
        borderRadius: 'lg',
        transition: 'all 0.2s',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'xl',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '2xl',
          },
        },
      },
    },
  },
})

// Configuración de Mantle Sepolia
const mantleSepolia = {
  ...mainnet,
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  network: 'mantle-sepolia',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
}

// Configuración de zkSync Era Testnet
const zkSyncTestnet = {
  ...mainnet,
  id: 280,
  name: 'zkSync Era Testnet',
  network: 'zksync-era-testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://testnet.era.zksync.dev'] },
    public: { http: ['https://testnet.era.zksync.dev'] },
  },
}

const { chains, publicClient } = configureChains(
  [mantleSepolia, zkSyncTestnet],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'UniFood',
  projectId: 'YOUR_PROJECT_ID', // Reemplaza esto con tu projectId de WalletConnect
  chains,
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  if (showWelcome) {
    return (
      <ChakraProvider theme={theme}>
        <CSSReset />
        <WelcomeScreen onStart={() => setShowWelcome(false)} />
      </ChakraProvider>
    )
  }

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <CSSReset />
          <Button
            aria-label="Abrir chat"
            leftIcon={<FaComment size="24px" />}
            size="lg"
            colorScheme="blue"
            position="fixed"
            bottom="8"
            right="8"
            borderRadius="full"
            boxShadow="lg"
            onClick={() => setIsChatOpen(true)}
            zIndex={999}
            height="60px"
            width="60px"
            padding="0"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
            }}
            _active={{
              transform: 'scale(0.95)',
            }}
            transition="all 0.2s ease-in-out"
            title="Chat con el asistente virtual"
          />
          <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <Box minH="100vh" bg="gray.50">
            <Box
              as="header"
              bg={bgColor}
              boxShadow="sm"
              position="sticky"
              top={0}
              zIndex={1}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <Container maxW="container.xl" py={4}>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={4}>
                    <Box
                      p={2}
                      bg="brand.50"
                      borderRadius="full"
                    >
                      <Icon as={FaUniversity} w={8} h={8} color="brand.500" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="lg" color="brand.500">
                        UniFood
                      </Heading>
                      <Text fontSize="sm" color="gray.500">
                        Plataforma de Becas Estudiantiles
                      </Text>
                    </VStack>
                  </Flex>
                  <Spacer />
                  <ConnectButton />
                </Flex>
              </Container>
            </Box>

            <Container maxW="container.xl" py={12}>
              <VStack spacing={12} w="full">
                <Box textAlign="center" w="full" mb={8}>
                  <Heading 
                    as="h1" 
                    size="2xl" 
                    bgGradient="linear(to-r, brand.500, brand.700)"
                    bgClip="text"
                    letterSpacing="tight"
                    fontWeight="extrabold"
                    mb={4}
                  >
                    Bienvenido a UniFood
                  </Heading>
                  <Text 
                    fontSize="xl" 
                    color="gray.600" 
                    maxW="2xl"
                    mx="auto"
                  >
                    Gestiona tus becas y realiza pagos en las cafeterías del campus de manera segura y eficiente
                  </Text>
                </Box>

                <Grid
                  templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                  gap={8}
                  w="full"
                >
                  <GridItem>
                    <Flex
                      direction="column"
                      bg={bgColor}
                      p={8}
                      borderRadius="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                      transition="all 0.2s"
                      h="full"
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        position="absolute"
                        top={0}
                        right={0}
                        w="200px"
                        h="200px"
                        bgGradient="linear(to-br, brand.50, brand.100)"
                        opacity={0.1}
                        borderRadius="full"
                        transform="translate(30%, -30%)"
                      />
                      <Flex align="center" mb={6}>
                        <Box
                          p={3}
                          bg="brand.50"
                          borderRadius="full"
                          mr={4}
                        >
                          <Icon as={FaGraduationCap} w={8} h={8} color="brand.500" />
                        </Box>
                        <Heading size="lg" color="brand.500">
                          Gestión de Becas
                        </Heading>
                      </Flex>
                      <VStack spacing={6} align="stretch">
                        <Text color="gray.600">
                          Administra tus becas estudiantiles de manera sencilla y eficiente
                        </Text>
                        <ClaimScholarship />
                      </VStack>
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Flex
                      direction="column"
                      bg={bgColor}
                      p={8}
                      borderRadius="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                      transition="all 0.2s"
                      h="full"
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        position="absolute"
                        top={0}
                        right={0}
                        w="200px"
                        h="200px"
                        bgGradient="linear(to-br, brand.50, brand.100)"
                        opacity={0.1}
                        borderRadius="full"
                        transform="translate(30%, -30%)"
                      />
                      <Flex align="center" mb={6}>
                        <Box
                          p={3}
                          bg="brand.50"
                          borderRadius="full"
                          mr={4}
                        >
                          <Icon as={FaUtensils} w={8} h={8} color="brand.500" />
                        </Box>
                        <Heading size="lg" color="brand.500">
                          Cafetería
                        </Heading>
                      </Flex>
                      <VStack spacing={4} align="stretch">
                        <Text color="gray.600">
                          Realiza pagos y consulta tus gastos en las cafeterías del campus
                        </Text>
                        <CafeteriaSpending />
                      </VStack>
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Flex
                      direction="column"
                      bg={bgColor}
                      p={8}
                      borderRadius="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                      transition="all 0.2s"
                      h="full"
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        position="absolute"
                        top={0}
                        right={0}
                        w="200px"
                        h="200px"
                        bgGradient="linear(to-br, brand.50, brand.100)"
                        opacity={0.1}
                        borderRadius="full"
                        transform="translate(30%, -30%)"
                      />
                      <Flex align="center" mb={6}>
                        <Box
                          p={3}
                          bg="brand.50"
                          borderRadius="full"
                          mr={4}
                        >
                          <Icon as={FaRobot} w={8} h={8} color="brand.500" />
                        </Box>
                        <Heading size="lg" color="brand.500">
                          Asistente Virtual
                        </Heading>
                      </Flex>
                      <VStack spacing={6} align="stretch">
                        <Text color="gray.600" fontSize="lg">
                          Tu asistente personal está disponible 24/7 para ayudarte con:
                        </Text>
                        <VStack spacing={3} align="stretch">
                          <Flex align="center" p={3} bg="brand.50" borderRadius="lg">
                            <Box
                              w={2}
                              h={2}
                              bg="brand.500"
                              borderRadius="full"
                              mr={3}
                            />
                            <Text color="gray.700" fontWeight="medium">Información sobre becas</Text>
                          </Flex>
                          <Flex align="center" p={3} bg="brand.50" borderRadius="lg">
                            <Box
                              w={2}
                              h={2}
                              bg="brand.500"
                              borderRadius="full"
                              mr={3}
                            />
                            <Text color="gray.700" fontWeight="medium">Consultas de saldo</Text>
                          </Flex>
                          <Flex align="center" p={3} bg="brand.50" borderRadius="lg">
                            <Box
                              w={2}
                              h={2}
                              bg="brand.500"
                              borderRadius="full"
                              mr={3}
                            />
                            <Text color="gray.700" fontWeight="medium">Procesamiento de pagos</Text>
                          </Flex>
                          <Flex align="center" p={3} bg="brand.50" borderRadius="lg">
                            <Box
                              w={2}
                              h={2}
                              bg="brand.500"
                              borderRadius="full"
                              mr={3}
                            />
                            <Text color="gray.700" fontWeight="medium">Preguntas generales</Text>
                          </Flex>
                        </VStack>
                        <Button
                          colorScheme="brand"
                          leftIcon={<FaComment />}
                          onClick={() => setIsChatOpen(true)}
                          mt={4}
                          size="lg"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          transition="all 0.2s"
                        >
                          Iniciar Chat
                        </Button>
                      </VStack>
                    </Flex>
                  </GridItem>
                </Grid>
              </VStack>
            </Container>

            <Box as="footer" bg={bgColor} py={8} mt={12} borderTop="1px" borderColor={borderColor}>
              <Container maxW="container.xl">
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="brand.500">UniFood</Text>
                    <Text fontSize="sm" color="gray.500">
                      © 2024 Plataforma de Becas Estudiantiles
                    </Text>
                  </VStack>
                  <Flex gap={4}>
                    <Button variant="ghost" colorScheme="brand" size="sm">
                      Términos y Condiciones
                    </Button>
                    <Button variant="ghost" colorScheme="brand" size="sm">
                      Política de Privacidad
                    </Button>
                  </Flex>
                </Flex>
              </Container>
            </Box>
          </Box>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
