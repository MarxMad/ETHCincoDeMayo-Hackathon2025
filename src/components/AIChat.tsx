import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Avatar,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Badge,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import openaiService from '../services/openaiService';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: '¡Hola! Soy tu asistente virtual de UniFood. ¿En qué puedo ayudarte hoy?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiValid, setIsApiValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkApiKey = async () => {
    try {
      const isValid = await openaiService.validateApiKey();
      setIsApiValid(isValid);
      setError(null);
      
      if (!isValid) {
        setError('La API key de OpenAI no está configurada correctamente.');
        toast({
          title: 'Error de configuración',
          description: 'La API key de OpenAI no está configurada correctamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al validar API key:', error);
      setIsApiValid(false);
      setError('Error al validar la API key. Por favor, verifica tu configuración.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isApiValid !== true) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await openaiService.sendMessage(input);
      const assistantMessage: Message = {
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack>
            <Avatar icon={<FaRobot />} bg="blue.500" />
            <Text fontWeight="bold">Asistente Virtual</Text>
            <Badge colorScheme="blue">AI</Badge>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          {error && (
            <Alert status="error" variant="subtle">
              <AlertIcon />
              <Box>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          <VStack
            h="calc(100vh - 200px)"
            p={4}
            spacing={4}
            overflowY="auto"
            align="stretch"
          >
            {messages.map((message, index) => (
              <Flex
                key={index}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={message.sender === 'user' ? 'blue.500' : 'gray.100'}
                  color={message.sender === 'user' ? 'white' : 'gray.800'}
                  p={3}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text>{message.text}</Text>
                  <Text fontSize="xs" opacity={0.7} mt={1}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
              </Flex>
            ))}
            {isLoading && (
              <Flex justify="flex-start">
                <Box
                  bg="gray.100"
                  p={3}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Spinner size="sm" mr={2} />
                  <Text as="span">Pensando...</Text>
                </Box>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
            <Flex>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                mr={2}
                isDisabled={isLoading || isApiValid === false}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button
                colorScheme="blue"
                onClick={handleSend}
                isDisabled={!input.trim() || isLoading || isApiValid === false}
                leftIcon={<FaPaperPlane />}
              >
                Enviar
              </Button>
            </Flex>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AIChat; 