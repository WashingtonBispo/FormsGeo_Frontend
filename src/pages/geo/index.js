import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

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
  const position = [51.505, -0.09]
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

  }, []);

  return (
    <>
      <Header />

      <BodyContainer>
        <ResearchsContainer>
          <Box
            w={'100%'}
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
                <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                  </Marker>
                </MapContainer>
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
