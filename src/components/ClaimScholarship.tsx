import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Badge,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Icon,
  Tooltip,
  Heading,
  Avatar,
  AvatarBadge,
  Flex,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StatGroup,
  AspectRatio,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { FaGraduationCap, FaCheckCircle, FaHistory, FaInfoCircle, FaWallet, FaBell, FaUserGraduate, FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { scholarshipService } from '../services/api';
import { useAccount, useSignMessage, useNetwork, useContractWrite, useContractRead } from 'wagmi';
import { Tooltip as RechartsTooltip } from 'recharts';

interface Scholarship {
  id: string;
  amount: number;
  status: 'available' | 'claimed' | 'pending' | 'verified';
  claimDate?: string;
  type: string;
  requirements: string[];
  expirationDate: string;
  usageHistory?: {
    date: string;
    amount: number;
    location: string;
  }[];
}

const ZKSYNC_SEPOLIA_ID = 300; // ID de ZKsync Sepolia Testnet
const CONTRACT_ADDRESS = '0x44Ef6C17d14e35660dAe0769Ab42F6295f09fB48';
const MANTLE_ID = 5003;
const REGISTER_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_alumno", "type": "address" }
    ],
    "name": "registerStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "registeredStudents",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ClaimScholarship = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { write, isLoading: isClaiming } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: REGISTER_ABI,
    functionName: 'registerStudent',
    args: address ? [address] : undefined,
    onSuccess: () => {
      toast({
        title: '¡Beca reclamada!',
        description: 'Has sido registrado exitosamente como becario.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: 'No se pudo reclamar la beca. ¿Ya estás registrado?',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('brand.50', 'brand.900');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Tu beca está lista para ser reclamada', date: '2024-05-01', read: false },
    { id: 2, message: 'Nuevo beneficio disponible', date: '2024-04-30', read: false },
  ]);
  const [stats, setStats] = useState({
    totalUsed: 1500,
    remaining: 3500,
    monthlyAverage: 500,
    lastMonthChange: 15,
    transactions: [
      { date: '2024-04-01', amount: 200, type: 'gasto' },
      { date: '2024-04-15', amount: 300, type: 'gasto' },
      { date: '2024-05-01', amount: 1000, type: 'depósito' },
    ]
  });
  const [chartData, setChartData] = useState([
    { name: 'Ene', gasto: 400, presupuesto: 500 },
    { name: 'Feb', gasto: 300, presupuesto: 500 },
    { name: 'Mar', gasto: 600, presupuesto: 500 },
    { name: 'Abr', gasto: 200, presupuesto: 500 },
    { name: 'May', gasto: 500, presupuesto: 500 },
  ]);

  const [pieData, setPieData] = useState([
    { name: 'Alimentación', value: 40 },
    { name: 'Materiales', value: 30 },
    { name: 'Transporte', value: 20 },
    { name: 'Otros', value: 10 },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Gasto inusual detectado en abril',
      details: 'El gasto de $600 excede el promedio mensual de $400',
      date: '2024-04-30',
      icon: FaMoneyBillWave,
    },
    {
      id: 2,
      type: 'info',
      message: 'Fecha límite de beca próxima',
      details: 'Quedan 30 días para utilizar el saldo restante',
      date: '2024-05-01',
      icon: FaCalendarAlt,
    },
    {
      id: 3,
      type: 'success',
      message: 'Objetivo de ahorro alcanzado',
      details: 'Has ahorrado $500 este mes',
      date: '2024-05-02',
      icon: FaChartLine,
    },
  ]);

  // Hook para verificar el estado del estudiante
  const { data: isRegistered, isLoading: isChecking } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: REGISTER_ABI,
    functionName: 'registeredStudents',
    args: [address],
    enabled: !!address && isConnected && chain?.id === MANTLE_ID,
  });

  // Hook para registrar estudiante
  const { write: registerStudent, isLoading: isRegistering } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: REGISTER_ABI,
    functionName: 'registerStudent',
    args: [address],
    onSuccess: () => {
      toast({
        title: '¡Registro exitoso!',
        description: 'Has sido registrado como becario.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo registrar el estudiante',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Función para forzar el cambio de red
  const switchToMantle = async () => {
    if (!window.ethereum) {
      toast({
        title: 'Error',
        description: 'MetaMask no está instalado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Primero intentamos agregar la red si no existe
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x138b',
            chainName: 'Mantle Testnet',
            nativeCurrency: {
              name: 'Mantle',
              symbol: 'MNT',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.sepolia.mantle.https://endpoints.omniatech.io/v1/mantle/sepolia/public'],
            blockExplorerUrls: ['https://explorer.testnet.mantle.xyz'],
          }],
        });
      } catch (addError) {
        console.log('La red ya existe o hubo un error al agregarla:', addError);
      }

      // Luego forzamos el cambio de red
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x138b' }],
      });
      // Si llegamos aquí, el cambio fue exitoso
      toast({
        title: '¡Red cambiada!',
        description: 'Conectado a Mantle Testnet',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (switchError) {
      // Solo mostrar error si realmente ocurre
      if (
        typeof switchError === 'object' &&
        switchError !== null &&
        'code' in switchError &&
        (switchError as any).code === 4902
      ) {
        toast({
          title: 'Error',
          description: 'No se pudo cambiar a Mantle Testnet. Por favor intenta nuevamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo cambiar a Mantle Testnet. Por favor intenta nuevamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      console.error('Error al cambiar de red:', switchError);
    }
  };

  // Verificar y forzar el cambio de red cuando se conecta la wallet
  useEffect(() => {
    if (isConnected && chain) {
      console.log('Red actual:', chain.name);
      console.log('ID de la red:', chain.id);
      
      if (chain.id !== 5003) {
        toast({
          title: 'Cambiando de red',
          description: 'Cambiando a Mantle Testnet...',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        // Forzar el cambio de red
        switchToMantle();
      }
    }
  }, [chain, isConnected, toast]);

  const handleVerify = async () => {
    if (!studentId.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa tu ID de estudiante',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isConnected || !address) {
      toast({
        title: 'Error',
        description: 'Por favor conecta tu wallet primero',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (chain?.id !== MANTLE_ID) {
      toast({
        title: 'Error',
        description: 'Por favor conéctate a Mantle Testnet',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistered) {
        toast({
          title: 'Estudiante registrado',
          description: 'Tu beca ha sido verificada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setScholarship({
          id: studentId,
          amount: 0,
          status: 'verified',
          type: 'Beca de Excelencia',
          requirements: [
            'Estudiante registrado',
            'Wallet conectada'
          ],
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          usageHistory: []
        });
      } else {
        toast({
          title: 'Estudiante no registrado',
          description: 'No se encontró tu registro en el sistema de becas',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        setScholarship(null);
      }
    } catch (error) {
      console.error('Error al verificar estudiante:', error);
      toast({
        title: 'Error',
        description: `Error al verificar estudiante: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmClaim = async () => {
    if (!scholarship) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setScholarship({
        ...scholarship,
        status: 'claimed',
        claimDate: new Date().toISOString(),
      });
      
      toast({
        title: '¡Felicidades!',
        description: 'Has reclamado exitosamente tu beca',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo reclamar la beca. Por favor intenta nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRemainingAmount = () => {
    if (!scholarship?.usageHistory) return scholarship?.amount || 0;
    const used = scholarship.usageHistory.reduce((sum, usage) => sum + usage.amount, 0);
    return (scholarship.amount - used);
  };

  const handleClaim = () => {
    if (write) write();
  };

  return (
    <Box>
      {/* Header Section */}
      <Flex p={4} bg={cardBg} borderRadius="lg" mb={4} align="center">
        <HStack spacing={4}>
          <Avatar size="lg" icon={<FaUserGraduate />} bg="brand.500">
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <VStack align="start" spacing={0}>
            <Heading size="md">Gestión de Becas</Heading>
            <Text color="gray.500">Bienvenido, Estudiante</Text>
          </VStack>
        </HStack>
        <Spacer />
        <HStack spacing={4}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                icon={<FaBell />}
                variant="ghost"
                position="relative"
                aria-label="Alertas"
              >
                {alerts.some(a => a.type === 'warning') && (
                  <Box
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="red.500"
                    borderRadius="full"
                    w="4"
                    h="4"
                  />
                )}
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Alertas Recientes</PopoverHeader>
              <PopoverBody>
                <VStack spacing={3} align="stretch">
                  {alerts.map(alert => (
                    <HStack
                      key={alert.id}
                      p={2}
                      bg={alert.type === 'warning' ? 'red.50' : 
                          alert.type === 'info' ? 'blue.50' : 'green.50'}
                      borderRadius="md"
                      spacing={3}
                    >
                      <Icon as={alert.icon} 
                            color={alert.type === 'warning' ? 'red.500' : 
                                   alert.type === 'info' ? 'blue.500' : 'green.500'} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{alert.message}</Text>
                        <Text fontSize="sm" color="gray.600">{alert.details}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(alert.date).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaCog />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<FaUserGraduate />}>Mi Perfil</MenuItem>
              <MenuItem icon={<FaSignOutAlt />}>Cerrar Sesión</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>Verificar Beca</Tab>
          <Tab isDisabled={!studentId}>Detalles</Tab>
          <Tab isDisabled={!studentId}>Historial</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch" w="full">
              <FormControl>
                <FormLabel>ID de Estudiante</FormLabel>
                <Input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Ingresa tu ID de estudiante"
                  isDisabled={scholarship?.status === 'claimed'}
                />
                <FormHelperText>
                  Ingresa el ID que te proporcionó tu institución educativa
                </FormHelperText>
              </FormControl>

              <Button
                colorScheme="brand"
                onClick={handleVerify}
                isDisabled={!isConnected || chain?.id !== MANTLE_ID || isLoading || isChecking}
                isLoading={isLoading || isChecking}
                leftIcon={<FaGraduationCap />}
              >
                {isChecking ? 'Verificando...' : 'Verificar Beca'}
              </Button>

              {!isRegistered && isConnected && (
                <Button
                  colorScheme="brand"
                  onClick={() => registerStudent?.()}
                  isDisabled={!registerStudent || isRegistering}
                  isLoading={isRegistering}
                  leftIcon={<FaGraduationCap />}
                >
                  {isRegistering ? 'Registrando...' : 'Registrar Estudiante'}
                </Button>
              )}

              {!scholarship && studentId && (
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Verifica tu beca</AlertTitle>
                    <AlertDescription>
                      Ingresa tu ID de estudiante y haz clic en "Verificar Beca" para ver los detalles de tu beca.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              <Button
                colorScheme="brand"
                onClick={handleClaim}
                isDisabled={!isConnected || chain?.id !== MANTLE_ID || !write}
                leftIcon={<FaGraduationCap />}
              >
                Reclamar Beca
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            {studentId ? (
              scholarship ? (
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Total Usado</StatLabel>
                          <StatNumber>${stats.totalUsed}</StatNumber>
                          <StatHelpText>
                            <StatArrow type="decrease" />
                            {stats.lastMonthChange}% vs mes anterior
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>

                    <Card bg={cardBg}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Saldo Restante</StatLabel>
                          <StatNumber>${stats.remaining}</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            {Math.round((stats.remaining / scholarship.amount) * 100)}% disponible
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>

                    <Card bg={cardBg}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Promedio Mensual</StatLabel>
                          <StatNumber>${stats.monthlyAverage}</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            {Math.round((stats.monthlyAverage / scholarship.amount) * 100)}% del total
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>

                    <Card bg={cardBg}>
                      <CardBody>
                        <Stat>
                          <StatLabel>Días Restantes</StatLabel>
                          <StatNumber>
                            {Math.ceil((new Date(scholarship.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                          </StatNumber>
                          <StatHelpText>
                            Hasta {new Date(scholarship.expirationDate).toLocaleDateString()}
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                    <Card bg={cardBg}>
                      <CardHeader>
                        <Heading size="md">Gastos Mensuales</Heading>
                      </CardHeader>
                      <CardBody>
                        <AspectRatio ratio={2}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Line type="monotone" dataKey="gasto" stroke="#8884d8" />
                              <Line type="monotone" dataKey="presupuesto" stroke="#82ca9d" />
                            </LineChart>
                          </ResponsiveContainer>
                        </AspectRatio>
                      </CardBody>
                    </Card>

                    <Card bg={cardBg}>
                      <CardHeader>
                        <Heading size="md">Distribución de Gastos</Heading>
                      </CardHeader>
                      <CardBody>
                        <AspectRatio ratio={2}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </AspectRatio>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Historial de Transacciones</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {stats.transactions.map((transaction, index) => (
                          <HStack key={index} justify="space-between" p={2} bg="white" borderRadius="md">
                            <HStack>
                              <Icon as={transaction.type === 'gasto' ? FaMoneyBillWave : FaChartLine} 
                                    color={transaction.type === 'gasto' ? 'red.500' : 'green.500'} />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">
                                  {transaction.type === 'gasto' ? 'Gasto' : 'Depósito'}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </Text>
                              </VStack>
                            </HStack>
                            <Text fontWeight="bold" color={transaction.type === 'gasto' ? 'red.500' : 'green.500'}>
                              ${transaction.amount}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              ) : (
                <Alert status="warning">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Beca no encontrada</AlertTitle>
                    <AlertDescription>
                      No se encontró una beca asociada a tu ID de estudiante. Por favor, verifica tu ID o contacta al departamento de becas.
                    </AlertDescription>
                  </Box>
                </Alert>
              )
            ) : (
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Ingresa tu ID</AlertTitle>
                  <AlertDescription>
                    Por favor, ingresa tu ID de estudiante en la pestaña "Verificar Beca" para ver los detalles de tu beca.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </TabPanel>

          <TabPanel>
            {studentId ? (
              scholarship ? (
                scholarship.usageHistory ? (
                  <VStack spacing={4} align="stretch">
                    {scholarship.usageHistory.map((usage, index) => (
                      <Box
                        key={index}
                        p={4}
                        bg={cardBg}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">{usage.location}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(usage.date).toLocaleDateString()}
                            </Text>
                          </VStack>
                          <Text fontWeight="bold" color="red.500">
                            -${usage.amount.toLocaleString()}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Sin historial</AlertTitle>
                      <AlertDescription>
                        Aún no hay registros de uso para esta beca.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )
              ) : (
                <Alert status="warning">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Beca no encontrada</AlertTitle>
                    <AlertDescription>
                      No se encontró una beca asociada a tu ID de estudiante. Por favor, verifica tu ID o contacta al departamento de becas.
                    </AlertDescription>
                  </Box>
                </Alert>
              )
            ) : (
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Ingresa tu ID</AlertTitle>
                  <AlertDescription>
                    Por favor, ingresa tu ID de estudiante en la pestaña "Verificar Beca" para ver el historial de tu beca.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ClaimScholarship; 