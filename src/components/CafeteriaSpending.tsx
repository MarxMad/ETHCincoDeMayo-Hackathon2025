import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Input,
  InputGroup,
  InputRightAddon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  useBreakpointValue,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Icon,
  Select,
  Badge,
} from '@chakra-ui/react'
import { useAccount, useContractRead, useContractWrite, useBalance } from 'wagmi'
import { useState } from 'react'
import { FaUtensils, FaStore, FaHistory } from 'react-icons/fa'

const CAFETERIAS = [
  { id: 1, name: 'Cafetería Central', location: 'Edificio Principal' },
  { id: 2, name: 'Cafetería Norte', location: 'Edificio Norte' },
  { id: 3, name: 'Cafetería Sur', location: 'Edificio Sur' },
]

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
    stateMutability: 'view',
  },
];

const CONTRACT_ADDRESS = '0x83501eAE542748590639649f2E951B653C509b1b';
const MANTLE_ID = 5003;

const CafeteriaSpending = () => {
  const { address } = useAccount()
  const toast = useToast()
  const [amount, setAmount] = useState('')
  const [selectedCafeteria, setSelectedCafeteria] = useState('')
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' })

  // Saldo real de la wallet (MNT)
  const { data: nativeBalance } = useBalance({
    address: address,
    chainId: MANTLE_ID,
    watch: true,
  });

  const { data: balance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  }) as { data: bigint | undefined }

  const { write: spend } = useContractWrite({
    address: '0x...',
    abi: [],
    functionName: 'spend',
  })

  const handleSpend = async () => {
    if (!amount || !selectedCafeteria) return
    
    try {
      await spend({
        args: [amount, selectedCafeteria],
      })
      toast({
        title: 'Pago exitoso',
        description: 'El pago ha sido procesado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setAmount('')
      setSelectedCafeteria('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al procesar el pago',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Card variant="filled" bg="brand.50" borderColor="brand.200">
        <CardBody>
          <Stat>
            <StatLabel color="gray.600" fontSize="sm">Saldo Disponible</StatLabel>
            <StatNumber color="brand.500" fontSize="3xl">
              {nativeBalance ? Number(nativeBalance.formatted).toFixed(4) : '0'} MNT
            </StatNumber>
            <StatHelpText color="gray.500">
              Actualizado al {new Date().toLocaleDateString()}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={FaStore} color="brand.500" />
            <Heading size="md">Realizar Pago</Heading>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4}>
            <Select
              placeholder="Selecciona una cafetería"
              value={selectedCafeteria}
              onChange={(e) => setSelectedCafeteria(e.target.value)}
              size={buttonSize}
              borderColor="brand.200"
              _hover={{ borderColor: 'brand.300' }}
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
            >
              {CAFETERIAS.map((cafeteria) => (
                <option key={cafeteria.id} value={cafeteria.id}>
                  {cafeteria.name} - {cafeteria.location}
                </option>
              ))}
            </Select>

            <InputGroup size={buttonSize}>
              <Input
                type="number"
                placeholder="Cantidad a gastar"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                borderColor="brand.200"
                _hover={{ borderColor: 'brand.300' }}
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
              />
              <InputRightAddon children="MNT" bg="brand.50" color="brand.700" />
            </InputGroup>

            <Button
              colorScheme="brand"
              onClick={handleSpend}
              isDisabled={!amount || !selectedCafeteria}
              size={buttonSize}
              w="full"
              leftIcon={<FaUtensils />}
            >
              Realizar Pago
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={FaHistory} color="brand.500" />
            <Heading size="md">Historial de Pagos</Heading>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text color="gray.500" textAlign="center">
              Próximamente: Historial detallado de pagos
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}

export default CafeteriaSpending 