import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  Image,
  Flex,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Badge,
  HStack,
  Divider,
  Grid,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaGraduationCap, FaUtensils, FaRobot, FaCheck, FaArrowRight, FaWallet, FaShieldAlt, FaBolt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

interface WelcomeScreenProps {
  onStart: () => void
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [step, setStep] = useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgGradient = useColorModeValue(
    'linear(to-br, brand.50, brand.100)',
    'linear(to-br, gray.900, brand.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onStart()
    }
  }

  const features = [
    {
      icon: FaGraduationCap,
      title: 'Gestión de Becas',
      description: 'Administra tus becas de manera sencilla y segura',
      badge: 'Nuevo',
    },
    {
      icon: FaUtensils,
      title: 'Pagos en Cafeterías',
      description: 'Realiza pagos rápidos en las cafeterías del campus',
      badge: 'Popular',
    },
    {
      icon: FaRobot,
      title: 'Asistente Virtual',
      description: 'Obtén ayuda instantánea con nuestro asistente inteligente',
      badge: 'IA',
    },
  ]

  const benefits = [
    {
      icon: FaWallet,
      title: 'Pagos Seguros',
      description: 'Transacciones protegidas con tecnología blockchain',
    },
    {
      icon: FaShieldAlt,
      title: 'Datos Protegidos',
      description: 'Tus datos personales están siempre seguros',
    },
    {
      icon: FaBolt,
      title: 'Rápido y Eficiente',
      description: 'Procesamiento instantáneo de transacciones',
    },
  ]

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={20}
      px={4}
      position="relative"
      overflow="hidden"
    >
      {/* Fondo decorativo */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        w="200%"
        h="200%"
        bg="brand.50"
        opacity="0.1"
        transform="rotate(45deg)"
      />

      <VStack spacing={12} maxW="container.md" mx="auto" position="relative">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HStack spacing={4} justify="center" mb={4}>
            <Badge colorScheme="brand" fontSize="lg" px={3} py={1} borderRadius="full">
              Beta
            </Badge>
            <Badge colorScheme="green" fontSize="lg" px={3} py={1} borderRadius="full">
              Web3
            </Badge>
          </HStack>
          <Heading
            size="2xl"
            textAlign="center"
            bgGradient="linear(to-r, brand.500, brand.700)"
            bgClip="text"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            ¡Bienvenido a UniFood!
          </Heading>
          <Text fontSize="xl" textAlign="center" color={textColor} mt={4}>
            Tu plataforma integral para la gestión de becas estudiantiles
          </Text>
        </MotionBox>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <MotionBox
              key="step1"
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={8}>
                <Box
                  p={8}
                  bg={cardBg}
                  borderRadius="2xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor="brand.100"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                  transition="all 0.3s"
                >
                  <Image
                    src="/unifood-logo.png"
                    alt="UniFood Logo"
                    boxSize="200px"
                    objectFit="contain"
                  />
                </Box>
                <Text fontSize="lg" textAlign="center" color={textColor} maxW="2xl">
                  UniFood te ayuda a gestionar tus becas y realizar pagos en las cafeterías del campus de manera segura y eficiente.
                </Text>
              </VStack>
            </MotionBox>
          )}

          {step === 2 && (
            <MotionBox
              key="step2"
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={6}>
                <Heading size="lg" color="brand.700" textAlign="center">
                  Características Principales
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} w="full">
                  {features.map((feature, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Box
                        p={6}
                        bg={cardBg}
                        borderRadius="xl"
                        boxShadow="lg"
                        borderWidth="1px"
                        borderColor="brand.100"
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                        transition="all 0.3s"
                      >
                        <Flex direction="column" align="center" textAlign="center">
                          <Box
                            p={4}
                            bg="brand.50"
                            borderRadius="full"
                            mb={4}
                          >
                            <Icon as={feature.icon} color="brand.500" boxSize={8} />
                          </Box>
                          <Badge colorScheme="brand" mb={2}>
                            {feature.badge}
                          </Badge>
                          <Text fontWeight="bold" color="brand.700" mb={2}>
                            {feature.title}
                          </Text>
                          <Text color={textColor}>{feature.description}</Text>
                        </Flex>
                      </Box>
                    </MotionBox>
                  ))}
                </Grid>
              </VStack>
            </MotionBox>
          )}

          {step === 3 && (
            <MotionBox
              key="step3"
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={6}>
                <Box
                  p={8}
                  bg={cardBg}
                  borderRadius="2xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor="brand.100"
                  w="full"
                >
                  <VStack spacing={6}>
                    <Heading size="lg" color="brand.700" textAlign="center">
                      ¿Listo para comenzar?
                    </Heading>
                    <Text fontSize="lg" textAlign="center" color={textColor}>
                      Presiona el botón para acceder a tu dashboard y comenzar a usar UniFood.
                    </Text>
                    <Button
                      size="lg"
                      colorScheme="brand"
                      rightIcon={<FaArrowRight />}
                      onClick={handleNext}
                      px={8}
                      py={6}
                      fontSize="xl"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      transition="all 0.3s"
                    >
                      Comenzar
                    </Button>
                  </VStack>
                </Box>

                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="lg"
                  borderWidth="1px"
                  borderColor="brand.100"
                  w="full"
                >
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="brand.700" textAlign="center">
                      Beneficios Adicionales
                    </Heading>
                    <Divider />
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                      {benefits.map((benefit, index) => (
                        <Flex key={index} align="center" gap={3}>
                          <Icon as={benefit.icon} color="brand.500" boxSize={6} />
                          <Box>
                            <Text fontWeight="bold" color="brand.700">
                              {benefit.title}
                            </Text>
                            <Text fontSize="sm" color={textColor}>
                              {benefit.description}
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    </Grid>
                  </VStack>
                </Box>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>

        <Flex gap={4}>
          {[1, 2, 3].map((s) => (
            <MotionBox
              key={s}
              w="12px"
              h="12px"
              borderRadius="full"
              bg={step === s ? 'brand.500' : 'gray.300'}
              cursor="pointer"
              onClick={() => setStep(s)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </Flex>

        <Button
          variant="ghost"
          colorScheme="brand"
          onClick={onOpen}
          _hover={{ transform: 'translateY(-2px)' }}
          transition="all 0.3s"
        >
          Ver tutorial
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Guía de Uso</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={4}>Gestión de Becas</Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Verifica tu saldo actual
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Realiza depósitos a tu beca
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Consulta tu historial de transacciones
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading size="md" mb={4}>Pagos en Cafeterías</Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Selecciona la cafetería
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Ingresa el monto a pagar
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Confirma la transacción
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading size="md" mb={4}>Asistente Virtual</Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Realiza preguntas sobre la plataforma
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Obtén ayuda con tus transacciones
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="brand.500" />
                    Consulta información sobre becas y cafeterías
                  </ListItem>
                </List>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default WelcomeScreen 