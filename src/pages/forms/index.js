import React from "react";

import {
  Box,
  Avatar,
  useColorModeValue,
  Text,
  Tag,
  TagLabel
} from '@chakra-ui/react';

import {
  Select,
} from "chakra-react-select";

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";

import {
  BodyContainer,
  ResearchsContainer,
  ResearchContainer,
  OptionsContainer,
  AboutContainer,
  InforContainer
} from './styles';

import imgAvatar from '../../assets/pages/signIn/WomanChatting.png'

const dataResearchs = [
  {
    title: "Pesquisa campus gama",
    description: "formulários relacionados a pesquisa da faculdade do gama",
    status: "1",
    answers: "200",
    date: "30/02/2022"
  },
  {
    title: "Pesquisa campus gama",
    description: "formulários relacionados a pesquisa da faculdade do gama",
    status: "2",
    answers: "200",
    date: "30/02/2022"
  }
]

const SignIn = () => {
  const color = useColorModeValue('white', 'gray.700');

  const researchOptionHandle = (e, id) => {
    switch(e.value){
      case "Ativar":
        enableResearch(id);
        break;
      case "Compartilhar":
        disableResearch(id);
        break;
      case "Finalizar":
        finishResearch(id);
        break;
      case "Deletar":
        deleteResearch(id);
        break;
    }
  };

  const enableResearch = (id) => {

  }

  const disableResearch = (id) => {
    
  }

  const finishResearch = (id) => {
    
  }

  const deleteResearch = (id) => {
    
  }

  return (
    <>
      <Header />

      <CurrentRoute name={"Pesquisas"} route={"Pesquisas"}/>

      <BodyContainer>
        <ResearchsContainer>
          {dataResearchs.map((research) => {
            return (
              <Box
                maxW={'33%'}
                w={'full'}
                bg={color}
                boxShadow={'2xl'}
                padding= "0 8px"
                borderRadius="12px"
              >
                <ResearchContainer>
                  <OptionsContainer>
                    <Avatar
                      size={'xl'}
                      src={imgAvatar}
                      alt={'Avatar Alt'}
                      mb={4}
                      pos={'relative'}
                      _after={{
                        content: '""',
                        w: 4,
                        h: 4,
                        bg: 'green.300',
                        border: '2px solid white',
                        rounded: 'full',
                        pos: 'absolute',
                        bottom: 0,
                        right: 3,
                      }}/>

                    <Box>
                      <Select
                        className="basic-single"
                        placeholder="Opções"
                        onChange={(e) => {researchOptionHandle(e, dataResearchs.id)}}
                        options={[
                          {
                            label: "Ativar",
                            value: "Ativar",
                          },
                          {
                            label: "Compartilhar",
                            value: "Compartilhar"
                          },
                          {
                            label: "Finalizar",
                            value: "Finalizar"
                          },
                          {
                            label: "Deletar",
                            value: "Deletar"
                          }
                        ]}
                      />
                    </Box>
                  </OptionsContainer>

                  <AboutContainer>
                    <Text 
                        fontSize='22px' 
                        color="#181C32"
                        fontWeight="bold"
                      >
                        {research.title}
                    </Text>

                    <Text 
                        fontSize='16px' 
                        color="#B5B5C3"
                      >
                        {research.description}
                    </Text>
                    
                    <Text 
                        fontSize='14px' 
                        color="#5E6278"
                        fontWeight="bold"
                      >
                        status: 
                        <Tag 
                          size={"md"} 
                          key={"md"} 
                          variant='subtle' 
                          color={research.status === 1 ? '#62DBA9' : '#F64E60'}
                          marginLeft='8px'
                          >
                          <TagLabel>{research.status === 1 ? "Ativo" : "Finalizado"}</TagLabel>
                        </Tag>
                    </Text>
                  </AboutContainer>

                  <InforContainer>
                    <Box
                      width='50%'
                      marginRight='25%'
                      display='flex'
                      flexDirection='column'
                      justifyContent='center'
                      alignItems='center'
                      border='1px dotted black'
                    >
                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        marginLeft="8px"
                        fontWeight="bold"
                      >
                        {research.date}
                      </Text>

                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        marginLeft="8px"
                        fontWeight="bold"
                      >
                        desde
                      </Text>
                    </Box>

                    <Box
                      width='50%'
                      marginLeft='25%'
                      display='flex'
                      flexDirection='column'
                      justifyContent='center'
                      alignItems='center'
                      border='1px dotted black'
                    >
                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        marginLeft="8px"
                        fontWeight="bold"
                      >
                        {research.answers}
                      </Text>

                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        marginLeft="8px"
                        fontWeight="bold"
                      >
                        respostas
                      </Text>
                    </Box>
                  </InforContainer>
                </ResearchContainer>
              </Box>
            );  
          })}
        </ResearchsContainer>
      </BodyContainer>
    </> 
  );
};

export default SignIn;
