import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  useMapEvents, 
  Circle, 
  Popup 
} from 'react-leaflet'

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

  const maxRadio = 200;
  const minRadio = 5;
  const color = useColorModeValue('white', 'gray.700');

  const { state } = useLocation();
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

  const creationFlow = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    } else {
      showErrorToast("Serviços de geolocalização não são suportados por este browser");
    };
  }, [showErrorToast]);

  const editFlow = useCallback(() => {
    let result = [];
    if(state.geolocations.length == 0 )
    creationFlow();
    let json = JSON.parse(state.geolocations);

    json.map(x => {
      result.push(
        [x.latitude, x.longitude, x.radius]
      )
    })

    if(result.length> 0)
      setInitialPosition([result[0][0], result[0][1]]);
    else
      creationFlow();

    setPositions(result);
  },[state, creationFlow])

  useEffect(() => {
    if (state.isEdit)
      editFlow();
    else
      creationFlow();
  }, [creationFlow, editFlow, state]);

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

    console.log(position);
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

  const handleEditMapMarker = useCallback((position, index) => {
    let tempEditPosition = position;
    tempEditPosition.push(index);

    setEditPosition(position);
    
    setIsEdit(true);

    onOpenShareResearch();
  },[onOpenShareResearch]);

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
                  <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize='14px'>
                      Deseja alterar esse marcador?
                    </Text>

                    <Button
                      backgroundColor={'#00A3FF'}
                      color={'white'}
                      size='md'
                      width="80%"
                      onClick={() => {handleEditMapMarker(position, index)}}
                    >
                      Alterar
                    </Button>
                  </Box>
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
  }, [initialPosition, positions, handleEditMapMarker]);

  const handleSubmitGeo = () => {
    const postGeo = async () => {
      const submitPositions = positions.map(function(x){ 
        return{ 
        radius: x[2],
        longitude: x[1],
        latitude: x[0]
       };});
  
      const geoData = {
        formId: state.formId,
        geolocations: JSON.stringify(submitPositions)
      };
  
      await api.put('Form/geolocation', geoData);

      navigate('/');
    }

    postGeo();
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
              marginTop="20px"
              padding="0 2%"
            >
              <InforContainer>
                <Text 
                  fontSize='24px'
                  fontWeight='bold'
                >
                  Configure a ferramenta de Geolocalização!
                </Text>

                <QuestionContainer>
                  <Text 
                    fontSize='14px'
                    color='#7E8299'
                  >
                    Grava apenas quando o participante passar em uma área marcada no mapa.
                  </Text>

                  <SwitchContainer>
                    <Switch 
                      size="md" 
                      colorScheme='green'
                      defaultChecked={selectedFormFinalGetGeo} 
                      onChange={() => setSelectedFormFinalGetGeo(!setSelectedFormFinalGetGeo)}
                    />

                    <Text 
                      fontSize='14px'
                      marginLeft='8px'
                      color='#3F4254'
                    >
                      Grava apenas quando o participante passar em uma área marcada no mapa.
                    </Text>
                  </SwitchContainer>
                </QuestionContainer>

                <QuestionContainer>
                  <Text 
                    fontSize='14px'
                    color='#7E8299'
                  >
                    Gravar no momento em que o participante terminar de responder o formulário.
                  </Text>

                  <SwitchContainer>
                    <Switch 
                      size="md" 
                      colorScheme='green'
                      defaultChecked={selectedAsyncGetGeo} 
                      onChange={() => setSelectedAsyncGetGeo(!setSelectedAsyncGetGeo)}
                    />

                    <Text 
                      fontSize='14px'
                      marginLeft='8px'
                      color='#3F4254'
                    >
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
                  navigate('/questoes', {
                    state: {
                      numberQuestions: state.numberQuestions,
                      isEdit: state.isEdit,
                      formId: state.formId,
                      questions: state.questions
                    }
                  });
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
                Raio do marcador (m)
              </Text>

              <NumberInput 
                onChange={e => setSelectedRadio(e)}
                defaultValue={isEdit ? editPosition[2] : selectedRadio}
                max={maxRadio}
                min={minRadio}
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
