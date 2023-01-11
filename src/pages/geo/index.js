import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Popup } from 'react-leaflet'

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
  const [selectedRadio, setSelectedRadio] = useState(10);
  const [selectedFormFinalGetGeo, setSelectedFormFinalGetGeo] = useState(false);
  const [selectedAsyncGetGeo, setSelectedAsyncGetGeo] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editPosition, setEditPosition] = useState(null);

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

            setIsEdit(false);
            
            onOpenShareResearch();
        },            
    })    
  };

  const handleSaveSelectedPosition = () => {
    const position = [selectedPosition[0], selectedPosition[1], selectedRadio];

    let tempPositions = positions.map(p => p);
    tempPositions.push(position);

    setPositions(tempPositions);

    setSelectedRadio(10);

    onCloseShareResearch();
  };

  const handleUpdateSelectedPosition = () => {
    let tempPositions = positions.map(p => p);
    
    tempPositions[editPosition[3]][2] = selectedRadio;

    setPositions(tempPositions);

    onCloseShareResearch();
  };

  const handleDeleteSelectedPosition = () => {
    let tempPositions = positions.map(p => p);
    
    tempPositions.splice(editPosition[3], 1);

    setPositions(tempPositions);

    onCloseShareResearch();
  };

  const handleEditMapMarker = (position, index) => {
    let tempEditPosition = position;
    tempEditPosition.push(index);

    setEditPosition(position);
    
    setIsEdit(true);

    onOpenShareResearch();
  };

  const renderMap = useCallback(() => {
    return (
      <MapContainer 
        center={initialPosition} 
        zoom={13} 
        scrollWheelZoom
      >
        <Markers />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions && positions.map(((position, index) => {
          return (
            <Box
              key={index}
            >
              <Marker           
                position={[position[0], position[1]]}
              >
                <Popup>
                  <Button
                    backgroundColor={'#00A3FF'}
                    color={'white'}
                    marginTop={'24px'} 
                    size='md'
                    onClick={() => {handleEditMapMarker(position, index)}}
                  >
                    Editar ou deletar
                  </Button>
                </Popup>
              </Marker>

              <Circle 
                center={[position[0], position[1]]} 
                radius={position[2]} 
              />
            </Box>
          );
        }))}
      </MapContainer>
    );
  }, [selectedPosition, initialPosition, positions]);

  const handleSubmitGeo = () => {

  };

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
                    <Switch 
                      size="md" 
                      colorScheme='green'
                      defaultChecked={selectedFormFinalGetGeo} 
                      onChange={() => setSelectedFormFinalGetGeo(!setSelectedFormFinalGetGeo)}
                    />

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
                    <Switch 
                      size="md" 
                      colorScheme='green'
                      defaultChecked={selectedAsyncGetGeo} 
                      onChange={() => setSelectedAsyncGetGeo(!setSelectedAsyncGetGeo)}
                    />

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
                onClick={handleSubmitGeo}
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
              Ajuste o raio que será utilizado para coletar os dados do participante!
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display='flex'
            flexDir='column'
            justifyContent='center'
          >
            <QuestionContainer>
              <Text fontSize='14px'>
                Latitude do marcador
              </Text>

              <Text 
                fontSize='15px' 
                color='#3F4254'
                width='100%'
                border='2px dotted #E4E6EF'
                padding='4px'
                textAlign='center'
              >
                {isEdit ? editPosition[0] : selectedPosition[0]}
              </Text>
            </QuestionContainer>

            <QuestionContainer>
              <Text fontSize='14px'>
                Longitude do marcador
              </Text>

              <Text 
                fontSize='15px' 
                color='#3F4254'
                width='100%'
                border='2px dotted #E4E6EF'
                padding='4px'
                textAlign='center'
              >
                {isEdit ? editPosition[1] : selectedPosition[1]}
              </Text>
            </QuestionContainer>

            <QuestionContainer>
              <Text fontSize='14px'>
                Raio do marcador
              </Text>

              <NumberInput 
                onChange={e => setSelectedRadio(e)}
                defaultValue={isEdit ? editPosition[2] : selectedRadio}
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
            </QuestionContainer>
          </ModalBody>

          <ModalFooter 
            display='flex'
            justifyContent='space-between'
          >
            {isEdit ? (
              <>
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
                  onClick={handleUpdateSelectedPosition}
                >
                  Editar
                </Button>

                <Button 
                  backgroundColor={'#00A3FF'}
                  color={'white'}
                  mr={3}
                  onClick={handleDeleteSelectedPosition}
                >
                  Deletar
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </> 
  );
};

export default Geo;
