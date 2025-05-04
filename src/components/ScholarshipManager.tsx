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
  CardFooter,
  Divider,
  Badge,
  Icon,
} from '@chakra-ui/react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { useState } from 'react'
import { FaWallet, FaHistory } from 'react-icons/fa'

const ScholarshipManager = () => {
  const { address } = useAccount()
  const toast = useToast()
  const [amount, setAmount] = useState('')
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' })

  const { data: balance } = useContractRead({
    address: '0x...',
    abi: [],
    functionName: 'balanceOf',
    args: [address],
  }) as { data: bigint | undefined }

  const { write: deposit } = useContractWrite({
    address: '0x...',
    abi: [],
    functionName: 'deposit',
  })

  const handleDeposit = async () => {
    if (!amount) return
    
    try {
      await deposit({
        args: [amount],
      })
      toast({
        title: 'Depósito exitoso',
        description: 'Los fondos han sido depositados correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setAmount('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al realizar el depósito',
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
            <StatLabel color="gray.600" fontSize="sm">Saldo Actual</StatLabel>
            <StatNumber color="brand.500" fontSize="3xl">
              {typeof balance === 'bigint' ? balance.toString() : '0'} MNT
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
            <Icon as={FaWallet} color="brand.500" />
            <Heading size="md">Depositar Fondos</Heading>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4}>
            <InputGroup size={buttonSize}>
              <Input
                type="number"
                placeholder="Cantidad a depositar"
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
              onClick={handleDeposit}
              isDisabled={!amount}
              size={buttonSize}
              w="full"
              leftIcon={<FaWallet />}
            >
              Depositar
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Flex align="center" gap={2}>
            <Icon as={FaHistory} color="brand.500" />
            <Heading size="md">Historial de Transacciones</Heading>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text color="gray.500" textAlign="center">
              Próximamente: Historial detallado de transacciones
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}

export default ScholarshipManager 