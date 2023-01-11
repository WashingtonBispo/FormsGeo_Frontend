import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet'

import {
  Box,
  useToast,
  useColorModeValue,
  Text,
  Switch,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

import { api } from '../../services/api';

import Header from '../../components/header';

import {
  BodyContainer,
  ResearchsContainer,
  InforContainer,
  QuestionContainer,
  SwitchContainer,
  MapBodyContainer,
  ButtonContainer
} from './styles';

const Geo = () => {
  const [initialPosition, setInitialPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([0,0]);
  const [selectedRadio, setSelectedRadio] = useState(0);
  const [selectedFormFinalGetGeo, setSelectedFormFinalGetGeo] = useState(false);
  const [selectedAsyncGetGeo, setSelectedAsyncGetGeo] = useState(false);

  const { isOpen: isOpenShareResearch, onOpen: onOpenShareResearch, onClose: onCloseShareResearch } = useDisclosure();

  const color = useColorModeValue('white', 'gray.700');

  const toast = useToast();
  const navigate = useNavigate();

  const showErrorToast = useCallback((message) => {
    toast({
      title: message,
      position: 'top-right',
      status: 'error',
      isClosable: true,
    });
  }, [toast]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    } else {
      showErrorToast("Serviços de geolocalização não são suportados por este browser");
    }
  }, [showErrorToast]);

  const Markers = () => {
    const map = useMapEvents({
        click(e) {                                
            setSelectedPosition([
                e.latlng.lat,
                e.latlng.lng
            ]); 
            
            onOpenShareResearch();
        },            
    })    
  };

  const handleSaveSelectedPosition = () => {
    const position = [selectedPosition[0], selectedPosition[1], selectedRadio];

    let tempPositions = positions.map(p => p);
    tempPositions.push(position);

    setPositions(tempPositions);

    onCloseShareResearch();
  };

  const renderMap = useCallback(() => {
    return (
      <MapContainer 
        center={initialPosition} 
        zoom={13} 
        scrollWheelZoom
        onClick={(e) => {console.log("clicado")}}
      >
        <Markers />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions && positions.map((position => {
          return (
            <>
              <Marker           
                key={selectedPosition[0]}
                position={[position[0], position[1]]}
                interactive={false} 
              />

              <Circle center={[position[0], position[1]]} radius={position[2]} />
            </>
          );
        }))}
      </MapContainer>
    );
  }, [selectedPosition, initialPosition, positions]);

  return (
    <>
      <Header />

      <BodyContainer>
        <ResearchsContainer>
          <Box
            w={'100%'}
            maxW="1400px"
            bg={color}
            boxShadow={'2xl'}
            borderRadius='12px'
          >
            <Box
              width="100%"
              display="flex"
              flexDir="row"
            >
              <InforContainer>
                <Text fontSize='14px'>
                  Configure a ferramenta de Geolocalização!
                </Text>

                <QuestionContainer>
                  <Text fontSize='14px'>
                    Grava apenas quando o participante passar em uma área marcada no mapa.
                  </Text>

                  <SwitchContainer>
                    <Switch size="md" colorScheme='green' />

                    <Text fontSize='14px'>
                      Grava apenas quando o participante passar em uma área marcada no mapa.
                    </Text>
                  </SwitchContainer>
                </QuestionContainer>

                <QuestionContainer>
                  <Text fontSize='14px'>
                    Gravar no momento em que o participante terminar de responder o formulário.
                  </Text>

                  <SwitchContainer>
                    <Switch size="md" colorScheme='green' onChange={e => console.log(e.target.value)}/>

                    <Text fontSize='14px'>
                      Gravar na finalização do formulário pelo participante.
                    </Text>
                  </SwitchContainer>
                </QuestionContainer>
              </InforContainer>
              
              <MapBodyContainer>
                {initialPosition ? renderMap() : (<></>)}
              </MapBodyContainer>
            </Box>

            <ButtonContainer>
              <Button 
                backgroundColor={'#F5F8FA'}
                color={'#7E8299'}
                marginTop={'24px'} 
                size='md'
                onClick={() => {
                  navigate('/');
                }}
              >
                Voltar
              </Button>

              <Button
                backgroundColor={'#00A3FF'}
                color={'white'}
                marginTop={'24px'} 
                size='md'
              >
                Finalizar
              </Button>
            </ButtonContainer>
          </Box>
        </ResearchsContainer>
      </BodyContainer>

      <Modal blockScrollOnMount={false} isOpen={isOpenShareResearch} onClose={onCloseShareResearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text 
              fontSize='16px' 
              color='#3F4254'
            >
              Ajuste o raio que será utilizado para coletar os dados geográficos!
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display='flex'
            justifyContent='center'
          >
            <Text 
              fontSize='15px' 
              color='#3F4254'
              width='100%'
              border='2px dotted #E4E6EF'
              padding='4px'
              textAlign='center'
            >
              x:{selectedPosition[0]}
            </Text>

            <Text 
              fontSize='15px' 
              color='#3F4254'
              width='100%'
              border='2px dotted #E4E6EF'
              padding='4px'
              textAlign='center'
            >
              y:{selectedPosition[1]}
            </Text>

            <NumberInput 
              onChange={e => setSelectedRadio(e)}
              defaultValue={10}
              max={200}
              min={5}
              clampValueOnBlur={false}
              >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ModalBody>

          <ModalFooter 
            display='flex'
            justifyContent='space-between'
          >
            <Button 
              backgroundColor={'#F5F8FA'}
              color={'#7E8299'}
              mr={3}
              onClick={onCloseShareResearch}
            >
              Voltar
            </Button>

            <Button 
              backgroundColor={'#00A3FF'}
              color={'white'}
              mr={3}
              onClick={handleSaveSelectedPosition}
            >
              Adicionar
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </> 
  );
};

export default Geo;
