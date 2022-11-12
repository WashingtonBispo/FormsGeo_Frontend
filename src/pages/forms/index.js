import React, { useCallback, useEffect, useState } from "react";
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import jwt_decode from "jwt-decode";

import { compressImage, parsePictureToBase64, parseBase64ToPicture } from "../../utils/img"

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

import { MdOutlineAddCircle } from 'react-icons/md'

import { api } from "../../services/api";

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";

import {
  BodyContainer,
  ResearchsContainer,
  ResearchContainer,
  OptionsContainer,
  AboutContainer,
  InforContainer,
  SearchContainer,
  AddResearchContainer
} from './styles';

import imgAvatar from '../../assets/pages/forms/Icon.png'

const Forms = () => {
  const token = useSelector((state) => state.authReducer.token);
  const color = useColorModeValue('white', 'gray.700');
  
  const [email, setEmail] = useState('');
  const [researchs, setResearchs] = useState([]);
  const [count, setCount] = useState(0);
  const [searchInfor, setSearchInfor] = useState('');
  const [name, setName] = useState('');
  const [linkTerm, setLinkTerm] = useState('');
  const [description, setDescription] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [invalidName, setInvalidName] = useState(false);
  const [invalidLinkTerm, setInvalidLinkTerm] = useState(false);
  const [icon, setIcon] = useState(null);
  const [hasImg, setHasImg] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const { isOpen: isOpenResearch, onOpen: onOpenResearch, onClose: onCloseResearch } = useDisclosure();
  const { isOpen: isOpenShareResearch, onOpen: onOpenShareResearch, onClose: onCloseShareResearch } = useDisclosure();
  const toast = useToast();

  const showErrorToast = useCallback((message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }, [toast]);

  const getResearchs = useCallback(async (email) => {
    try 
    {
      const response = await api.get("Form/List", { params: { email: email } });

      let responseData = response.data;

      for (let i = 0; i < responseData.length; i++){
        const imgUrl = await parseBase64ToPicture(responseData[i].icon);
        responseData[i].icon = imgUrl.url;
      }

      setResearchs(responseData);
    } catch (e)
    {
      showErrorToast("Ocorreu um erro ao listar os usuários.");
    }
  }, [showErrorToast])

  useEffect(() => {
    const decoded = jwt_decode(token);
    
    setEmail(decoded.email);

    getResearchs(decoded.email);
  }, [getResearchs, count]);

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
    name: Yup.string()
      .required('Nome obrigatório')
  });

  const handleChangeName = (event) => setName(event.target.value);
  
  const handleChangeLinkTerm = (event) => setLinkTerm(event.target.value);

  const researchOptionHandle = (e, id) => {
    switch(e.value){
      case "Ativar":
        changeStatusResearch(id, 1);
        break;
      case "Compartilhar":
        setShareLink(id);
        onOpenShareResearch();
        break;
      case "Finalizar":
        changeStatusResearch(id, 3);
        break;
      case "Deletar":
        deleteResearch(id);
        break;
    }
  };

  const changeStatusResearch = (id, status) => {
    const HandleResearch = async (id, status) => {
      try{
        const researchData = {
          formId: id,
          status
        };
        
        await api.put("Form/", researchData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast("Ocorreu um erro ao remover um usuário.");
      }
    }
    HandleResearch(id, status);
  }

  const deleteResearch = (id) => {
    const HandleResearch = async (id) => {
      try{
        const researchData = {
          formId: id
        };
        
        await api.delete("Form/", researchData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast("Ocorreu um erro ao remover um usuário.");
      }
    }
    
    HandleResearch(id);
  }

  const handleInputChange = async (tempPicture) => {
    const newFile = {
      file: tempPicture[0],
      url: URL.createObjectURL(tempPicture[0]),
    };

    setHasImg(true);
    setIcon(newFile);
  };

  const compressPicture = async (pic) => {
    try {
      return await compressImage(pic.file);
    } catch {
      showErrorToast("Ocorreu um erro ao comprimir o icone.");
    }
    return null;
  };

  const handleSubmitForm = () => {
    const postForm = async () => {
      let base64Image;

      if (hasImg) {
        const compressedPicture = await compressPicture(icon);
        if (compressedPicture)
          base64Image = await parsePictureToBase64(compressedPicture);
      }

      const postData = {
        email,
        name,
        linkConsent: linkTerm,
        description,
        finalMessage,
        gatherEnd: false,
        gatherPassage: false,
        icon: base64Image.replace('data:image/png;base64,', '')
      }

      await api.post("Form", postData);

      setCount(count + 1);
    }

    postForm();
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
            onClick={onOpenResearch}
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
                      src={research.icon}
                      alt={'Avatar Alt'}
                      />

                    <Box width="160px">
                      <Select
                        className="basic-single"
                        placeholder="Opções"
                        onChange={(e) => {researchOptionHandle(e, research.idForm)}}
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
                        {research.name}
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
                        fontSize='16px' 
                        color="#3F4254" 
                        fontWeight="bold"
                      >
                        {research.createdAt.substring(0, 10).replaceAll("-", "/")}
                      </Text>

                      <Text 
                        fontSize='16px' 
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
                        fontSize='16px' 
                        color="#3F4254" 
                        fontWeight="bold"
                      >
                        {12/*research.answers*/}
                      </Text>

                      <Text 
                        fontSize='16px' 
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

      <Modal blockScrollOnMount={false} isOpen={isOpenResearch} onClose={onCloseResearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddResearchContainer>
              <InputGroup 
                size='md' 
                marginTop="14px"
                display="flex"
                flexDir="column"
              >
                <label
                  className="img-icon"
                  htmlFor="research-icon"
                >
                  <input
                    style={{display: "none"}}
                    type="file"
                    id="research-icon"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleInputChange(e.target.files);
                      }
                    }}
                  />

                  <MdOutlineAddCircle />
                  
                  {!hasImg ? (
                    <Text
                      fontSize='18px' 
                      color="#3F4254"
                    >
                      Adicionar ícone
                    </Text>
                  ) : (
                    <Text
                      fontSize='18px' 
                      color="#3F4254"
                    >
                      {icon.file.name}
                    </Text>
                  )}
                  
                </label>

                <Input
                  placeholder="Nome"
                  isInvalid={invalidName}
                  value={name}
                  onChange={handleChangeName}
                  pr='4.5rem'
                  type='text'
                  marginBottom="8px"
                  />

                <Input
                  placeholder="Link do termo de consentimento"
                  isInvalid={invalidLinkTerm}
                  value={linkTerm}
                  onChange={handleChangeLinkTerm}
                  pr='4.5rem'
                  type='text'
                  marginBottom="8px"
                  />

                <Box
                  marginBottom="8px"
                >
                  <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Descrição e termo de  consentimento</p>"
                    onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setDescription(data);
                  } }
                  />
                </Box>
                
                <Box>
                  <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Mensagem final</p>"
                    onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setFinalMessage(data);
                  } }
                  />
                </Box>
              </InputGroup>
            </AddResearchContainer>
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

      <Modal blockScrollOnMount={false} isOpen={isOpenShareResearch} onClose={onCloseShareResearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text 
              fontSize='16px' 
              color="#3F4254"
            >
              Compartilhe este código com os participantes de sua pesquisa!
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="center"
          >
            <Text 
              fontSize='15px' 
              color="#3F4254"
              width="100%"
              border="2px dotted #E4E6EF"
              padding="4px"
              textAlign="center"
            >
              {shareLink}
            </Text>
          </ModalBody>

          <ModalFooter 
            display="flex"
            justifyContent="center"
          >
            <Button 
              backgroundColor={'#F5F8FA'}
              color={'#7E8299'}
              mr={3}
              onClick={handleSubmitForm}
            >
              Voltar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </> 
  );
};

export default Forms;
