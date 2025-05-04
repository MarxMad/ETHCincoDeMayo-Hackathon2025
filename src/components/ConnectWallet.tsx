import { useAccount, useNetwork, useConnect, useDisconnect } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';

const MANTLE_TESTNET_ID = 5003;

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect, connectors } = useConnect({
    onSuccess: () => {
      console.log('Wallet conectada exitosamente');
    },
    onError: (error) => {
      console.error('Error al conectar wallet:', error);
    }
  });
  const { disconnect } = useDisconnect();
  const toast = useToast();
  const hasShownSuccess = useRef(false);

  // Verificar la red y mostrar mensajes
  useEffect(() => {
    if (chain) {
      console.log('Red actual:', chain.name);
      console.log('ID de la red:', chain.id);
      
      if (chain.id !== MANTLE_TESTNET_ID) {
        toast({
          title: 'Red incorrecta',
          description: 'Por favor cambia a Mantle Testnet',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        hasShownSuccess.current = false;
      } else if (isConnected && !hasShownSuccess.current) {
        toast({
          title: '¡Conexión exitosa!',
          description: 'Conectado a Mantle Testnet',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        hasShownSuccess.current = true;
      }
    }
  }, [chain, isConnected, toast]);

  const handleConnect = () => {
    const connector = connectors[0]; // Usar el primer conector (MetaMask)
    connect({ connector });
  };

  const handleDisconnect = () => {
    disconnect();
    hasShownSuccess.current = false;
  };

  if (isConnected) {
    return (
      <Button
        onClick={handleDisconnect}
        colorScheme="blue"
        variant="outline"
        size="md"
        rightIcon={<FaWallet />}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      colorScheme="blue"
      size="md"
      rightIcon={<FaWallet />}
    >
      Conectar Wallet
    </Button>
  );
};

export default ConnectWallet; 