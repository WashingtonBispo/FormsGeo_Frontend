import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

import {
  Box,
  useToast,
  useColorModeValue,
  Text,
  Switch,
  Button
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
  const [selectedPosition, setSelectedPosition] = useState([0,0]);

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
        },            
    })

    return (
        selectedPosition ? 
            <Marker           
            key={selectedPosition[0]}
            position={selectedPosition}
            interactive={false} 
            />
        : null
    )   
    
}

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
      </MapContainer>
    );
  }, [selectedPosition, initialPosition]);

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
                    <Switch size="md" colorScheme='green' />

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
    </> 
  );
};

export default Geo;
