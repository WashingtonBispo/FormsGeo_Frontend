import React, { useCallback, useEffect } from "react";
import { useDisclosure, useToast } from '@chakra-ui/react';

import * as Yup from 'yup';

import {
  Box,
  Avatar,
  useColorModeValue,
  Text,
  Tag,
  TagLabel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  Input
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
  InforContainer,
  SearchContainer
} from './styles';

import imgAvatar from '../../assets/pages/forms/Icon.png'

const dataResearchs = [
  {
    title: "Pesquisa campus gama",
    description: "formulários relacionados a pesquisa da faculdade do gama",
    status: 1,
    answers: "200",
    date: "30/02/2022"
  },
  {
    title: "Pesquisa campus gama",
    description: "formulários relacionados a pesquisa da faculdade do gama",
    status: 2,
    answers: "200",
    date: "30/02/2022"
  },
  {
    title: "Pesquisa campus gama",
    description: "formulários relacionados a pesquisa da faculdade do gama",
    status: 1,
    answers: "200",
    date: "30/02/2022"
  },
  {
    title: "Pesquisa campus gama",
    description: "formulários relacionados a pesquisa da faculdade do gama",
    status: 1,
    answers: "200",
    date: "30/02/2022"
  }
]

const SignIn = () => {
  const [researchs, setResearchs] = React.useState([]);
  const [searchInfor, setSearchInfor] = React.useState('');
  const [name, setName]  = React.useState('');
  const [linkTerm, setLinkTerm]  = React.useState('');
  const [description, setDescription]  = React.useState('');
  const [finalMessage, setFinalMessage]  = React.useState('');
  const [invalidName, setInvalidName]  = React.useState(false);
  const [invalidLinkTerm, setInvalidLinkTerm]  = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const color = useColorModeValue('white', 'gray.700');

  const showErrorToast = useCallback((message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }, [toast]);

  const getResearchs = useCallback(async (filter) => {
    try 
    {
      const responseData = dataResearchs;

      setResearchs(responseData);
    } catch (e)
    {
      showErrorToast("Ocorreu um erro ao listar os usuários.");
    }
  }, [showErrorToast])

  useEffect(() => {
    getResearchs();
  }, [getResearchs]);

  const handleChangeSearchInfor = useCallback((event) => {
    const currentSearchInfor = event.target.value;

    setSearchInfor(currentSearchInfor);

    if (currentSearchInfor.length >= 3){
      getResearchs(currentSearchInfor);
    }else{
      getResearchs();
    }
  }, [getResearchs]);

  const schema = Yup.object().shape({
    email: Yup.string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
    password: Yup.string()
      .min(8,'Senha de no minimo 8 caractéres')
      .required('Senha obrigatória'),
  });

  const handleChangeName = (event) => setName(event.target.value);
  
  const handleChangeLinkTerm = (event) => setLinkTerm(event.target.value);

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

  const handleSubmitForm = () => {

  }

  return (
    <>
      <Header />

      <Box
        backgroundColor="#F5F5F5"
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <CurrentRoute name={"Pesquisas"} route={"Pesquisas"} />

        <Button 
            backgroundColor={'#20D489'}
            color={'white'}
            size='md' 
            onClick={onOpen}
            marginRight="2%"
            >
            Cadatrar Pesquisa
        </Button>
      </Box>

      <SearchContainer>
        <InputGroup size='md'>
          <Input
            value={searchInfor}
            onChange={handleChangeSearchInfor}
            placeholder="Buscar pesquisas"
            backgroundColor="#DDDDDD"
            maxWidth='800px'
            margin="0 auto"
            pr='4.5rem'
            type='text'
            />
        </InputGroup>
      </SearchContainer>

      <BodyContainer>
        <ResearchsContainer>
          {researchs.map((research) => {
            return (
              <Box
                maxW={'32%'}
                w={'full'}
                bg={color}
                boxShadow={'2xl'}
                padding= "2%"
                borderRadius="12px"
                marginBottom="2%"
              >
                <ResearchContainer>
                  <OptionsContainer>
                    <Avatar
                      width={'40px'}
                      src={imgAvatar}
                      alt={'Avatar Alt'}
                      />

                    <Box width="160px">
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
                      display='flex'
                      flexDirection='column'
                      justifyContent='center'
                      alignItems='center'
                      border='1px dotted #E4E6EF'
                      borderRadius="8px"
                      padding="2%"
                    >
                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        fontWeight="bold"
                      >
                        {research.date}
                      </Text>

                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        fontWeight="bold"
                      >
                        desde
                      </Text>
                    </Box>

                    <Box
                      display='flex'
                      flexDirection='column'
                      justifyContent='center'
                      alignItems='center'
                      border='1px dotted #E4E6EF'
                      borderRadius="8px"
                      padding="2%"
                    >
                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
                        fontWeight="bold"
                      >
                        {research.answers}
                      </Text>

                      <Text 
                        fontSize='18px' 
                        color="#3F4254" 
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

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size='md' marginTop="14px">
              <Input
                placeholder="Nome"
                isInvalid={invalidName}
                value={name}
                onChange={handleChangeName}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
            <InputGroup size='md' marginTop="8px">
              <Input
                placeholder="Link do termo de consentimento"
                isInvalid={invalidLinkTerm}
                value={linkTerm}
                onChange={handleChangeLinkTerm}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
            <InputGroup size='md' marginTop="8px">
              <Input
                placeholder="Nome"
                isInvalid={invalidName}
                value={name}
                onChange={handleChangeName}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
            <InputGroup size='md' marginTop="8px">
              <Input
                placeholder="Nome"
                isInvalid={invalidName}
                value={name}
                onChange={handleChangeName}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </ModalBody>

          <ModalFooter 
            display="flex"
            justifyContent="space-between"
          >
            <Button 
              backgroundColor={'#F5F8FA'}
              color={'#7E8299'}
              mr={3}
              onClick={handleSubmitForm}
            >
              Voltar
            </Button>
            <Button 
              backgroundColor={'#00A3FF'}
              color={'white'}
              mr={3}
              onClick={handleSubmitForm}
            >
              Próximo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </> 
  );
};

export default SignIn;
