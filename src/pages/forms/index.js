import React, { useCallback, useEffect, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import jwt_decode from 'jwt-decode';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

import { compressImage, parsePictureToBase64, parseBase64ToPicture } from '../../utils/img'

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
} from 'chakra-react-select';

import { MdOutlineAddCircle } from 'react-icons/md';

import getValidationErrors from '../../utils/getValidationErrors';
import { api } from '../../services/api';

import Header from '../../components/header';
import CurrentRoute from '../../components/currentRoute';

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

const Forms = () => {
  const token = useSelector((state) => state.authReducer.token);
  const color = useColorModeValue('white', 'gray.700');

  const chakraStyles = {
    dropdownIndicator: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "blue.100" : provided.background,
      p: 0,
      w: "40px",
    }),
  };

  const statusOptions = [
    {
      status: "Ativo",
      color: "#62DBA9",
      backgroundColor: "#E8FFF3",
      bottom: "#1DC894"
    },
    {
      status: "Arquivado",
      color: "#A9A9A9",
      backgroundColor: "#F5F5F5",
      bottom: "#A9A9A9"
    },
    {
      status: "Finalizado",
      color: "#F64E60",
      backgroundColor: "#FFE2E5",
      bottom: "#F64E60"
    },
    {
      status: "Preview",
      color: "#00A3FF",
      backgroundColor: "#F1FAFF",
      bottom: "#00A3FF"
    },
    {
      status: "Pré-teste",
      color: "#FFA800",
      backgroundColor: "#FFF4DE",
      bottom: "#FFA800"
    }
  ];

  const adminOptions = [
    {
      label: 'Ativar',
      value: 'Ativar',
    },
    {
      label: 'Editar',
      value: 'Editar',
    },
    {
      label: 'Compartilhar',
      value: 'Compartilhar'
    },
    {
      label: 'Finalizar',
      value: 'Finalizar'
    },
    {
      label: 'Deletar',
      value: 'Deletar'
    }
  ]

  const userOptions = [
    {
      label: 'Ativar',
      value: 'Ativar',
    },
    {
      label: 'Editar',
      value: 'Editar',
    },
    {
      label: 'Compartilhar',
      value: 'Compartilhar'
    },
    {
      label: 'Finalizar',
      value: 'Finalizar'
    }
  ]
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [researchId, setResearchId] = useState(null);
  const [email, setEmail] = useState('');
  const [researchs, setResearchs] = useState([]);
  const [count, setCount] = useState(0);
  const [searchInfor, setSearchInfor] = useState('');
  const [name, setName] = useState('');
  const [linkTerm, setLinkTerm] = useState('');
  const [description, setDescription] = useState('<p>Descrição e termo de  consentimento</p>');
  const [finalMessage, setFinalMessage] = useState('<p>Mensagem final</p>');
  const [invalidName, setInvalidName] = useState(false);
  const [icon, setIcon] = useState(null);
  const [hasImg, setHasImg] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen: isOpenResearch, onOpen: onOpenResearch, onClose: onCloseResearch } = useDisclosure();
  const { isOpen: isOpenShareResearch, onOpen: onOpenShareResearch, onClose: onCloseShareResearch } = useDisclosure();
  
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

  const getResearchs = useCallback(async (email, filter) => {
    try 
    {
      let response = null;

      if (isAdmin)
        response = await api.get('Form/List', { params: { email: email, filter: filter } });
      else
        response = await api.get('Form/List', { params: { filter: filter } });

      let responseData = response.data;

      for (let i = 0; i < responseData.length; i++){
        const imgUrl = await parseBase64ToPicture(responseData[i].icon);
        responseData[i].icon = imgUrl;
      }

      setResearchs(responseData);
    } catch (e)
    {
      showErrorToast('Ocorreu um erro ao listar os usuários.');
    }
  }, [showErrorToast, isAdmin])

  useEffect(() => {
    const decoded = jwt_decode(token);
    
    setEmail(decoded.email);
    
    if(decoded.role === "Admin"){
      setIsAdmin(true);
      getResearchs();
    }

    getResearchs(decoded.email);
  }, [getResearchs, count, token]);

  const handleChangeSearchInfor = useCallback((event) => {
    const currentSearchInfor = event.target.value;

    setSearchInfor(currentSearchInfor);

    if (currentSearchInfor.length >= 3){
      isAdmin ? getResearchs(null, currentSearchInfor) : getResearchs(email, currentSearchInfor);
    }else{
      isAdmin ? getResearchs(null) : getResearchs(email);
    }
  }, [getResearchs, email, isAdmin]);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Nome obrigatório')
    
  });

  const handleChangeName = (event) => setName(event.target.value);
  
  const handleChangeLinkTerm = (event) => setLinkTerm(event.target.value);

  const handlePopulateEditModal = (id) => {
    const research = researchs.find(r => r.idForm === id);

    setResearchId(id);
    setHasImg(true);
    setIcon(research.icon);
    setName(research.name);
    setLinkTerm(research.linkConsent);
    setDescription(research.description);
    setFinalMessage(research.finalMessage);
  }

  const handleClearModal = () => {
    onCloseResearch();
    setHasImg(false);
    setIcon(null);
    setName('');
    setLinkTerm('');
    setDescription('<p>Descrição e termo de  consentimento</p>');
    setFinalMessage('<p>Mensagem final</p>');
  }

  const researchOptionHandle = (e, id) => {
    switch(e.value){
      case 'Ativar':
        changeStatusResearch(id, 1);
        break;
      case 'Editar':
        handlePopulateEditModal(id);
        setIsEdit(true); 
        onOpenResearch();
        break;
      case 'Compartilhar':
        setShareLink(id);
        onOpenShareResearch();
        break;
      case 'Finalizar':
        changeStatusResearch(id, 3);
        break;
      case 'Deletar':
        deleteResearch(id);
        break;
      default:
        return;
    }
  };

  const changeStatusResearch = (id, status) => {
    const HandleResearch = async (id, status) => {
      try{
        const researchData = {
          formId: id,
          status
        };
        
        await api.put('Form/', researchData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast('Ocorreu um erro ao remover um usuário.');
      }
    }
    HandleResearch(id, status);
  }

  const deleteResearch = (id) => {
    console.log(id)
    const HandleResearch = async (id) => {
      try{ 
        await api.delete('Form/', { params: { formId: id } });
        setCount(count + 1);
      }
      catch (err){
        showErrorToast('Ocorreu um erro ao remover um usuário.');
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
      showErrorToast('Ocorreu um erro ao comprimir o icone.');
    }
    return null;
  };

  const htmlFrom = (htmlString) => {
    const cleanHtmlString = DOMPurify.sanitize(htmlString,
      { USE_PROFILES: { html: true } });
    const html = parse(cleanHtmlString);
    return html;
}

  const handleSubmitForm = () => {
    const postForm = async () => {
      try{
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
          status: 1,
          icon: base64Image.replace('data:image/png;base64,', '')
        }

        await schema.validate(postData, {
          abortEarly: false,
        });

        const formResponse = await api.post('Form', postData);

        navigate('/questoes', {
          state: {
            isEdit: false,
            formId: formResponse.data.formId
          }
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (errors.name !== undefined){
            showErrorToast(errors.name);
            setInvalidName(true);
          }
          else
            setInvalidName(false);

          return;
        }else{
          showErrorToast("Ocorreu um erro ao fazer o cadastro do formulário de pesquisa.");

          return;
        }
      }
    }

    postForm();
  }

  const handleEditForm = () => {
    const editForm = async () => {
      try{
        let base64Image;

        if (hasImg) {
          const compressedPicture = await compressPicture(icon);
          if (compressedPicture)
            base64Image = await parsePictureToBase64(compressedPicture);
        }

        const putData = {
          email,
          formId: researchId,
          name,
          linkConsent: linkTerm,
          description,
          finalMessage,
          gatherEnd: false,
          gatherPassage: false,
          icon: !base64Image ? '' : base64Image.replace('data:image/png;base64,', '')
        }

        await schema.validate(putData, {
          abortEarly: false,
        });

        await api.put('Form', putData);

        const researchQuestions = researchs.find(r => r.idForm === researchId).questions;
        navigate('/questoes', {
          state: {
            isEdit: true,
            formId: researchId,
            questions: researchQuestions
          }
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (errors.name !== undefined){
            showErrorToast(errors.name);
            setInvalidName(true);
          }
          else
            setInvalidName(false);

          return;
        }else{
          showErrorToast("Ocorreu um erro ao fazer o cadastro do formulário de pesquisa.");

          return;
        }
      }
    }

    editForm();
  }

  return (
    <>
      <Header />

      <Box
        backgroundColor='#F5F5F5'
        width='100%'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <CurrentRoute name={'Pesquisas'} route={'Pesquisas'} />

        <Button 
            backgroundColor={'#20D489'}
            color={'white'}
            size='md' 
            onClick={() => {
              setIsEdit(false); 
              onOpenResearch();
            }}
            marginRight='2%'
            >
            Cadatrar Pesquisa
        </Button>
      </Box>

      <SearchContainer>
        <InputGroup size='md'>
          <Input
            value={searchInfor}
            onChange={handleChangeSearchInfor}
            placeholder='Buscar pesquisas'
            backgroundColor='#DDDDDD'
            maxWidth='800px'
            margin='0 auto'
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
                key={research.idForm}
                maxW={'31%'}
                w={'full'}
                bg={color}
                boxShadow={'2xl'}
                borderRadius='12px'
                marginLeft='1%'
                marginRight='1%'
                marginBottom='2%'
                overflow="hidden"
              >
                <ResearchContainer>
                  <OptionsContainer>
                    <Avatar
                      width={'40px'}
                      src={research.icon.url}
                      alt={'Avatar Alt'}
                      />

                    <Box width='160px'>
                      <Select
                        className='basic-single'
                        placeholder='Opções'
                        onChange={(e) => {researchOptionHandle(e, research.idForm)}}
                        options={isAdmin ? adminOptions : userOptions}
                        chakraStyles={chakraStyles}
                      />
                    </Box>
                  </OptionsContainer>

                  <AboutContainer>
                    <Text 
                        fontSize='22px' 
                        color='#181C32'
                        fontWeight='bold'
                      >
                        {research.name}
                    </Text>

                    <Text 
                      fontSize='16px' 
                      color='#B5B5C3'
                    >
                      {research.description && htmlFrom(research.description)}
                    </Text>

                    {isAdmin ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        marginBottom="4px"
                      >
                        <Text 
                          fontSize='14px' 
                          color='#5E6278'
                          fontWeight='bold'
                        >
                          Pesquisador: 
                        </Text>

                        <Text 
                          fontSize='16px' 
                          color='#B5B5C3'
                          marginLeft="4px"
                        >
                          {"pesquisador"}
                        </Text>
                      </Box>
                    ) : (
                      <></>
                    )}
                    
                    <Text 
                        fontSize='14px' 
                        color='#5E6278'
                        fontWeight='bold'
                      >
                        status: 
                        <Tag 
                          size={'md'} 
                          key={'md'} 
                          variant='subtle' 
                          color={statusOptions[research.status-1].color}
                          backgroundColor={statusOptions[research.status-1].backgroundColor}
                          marginLeft='8px'
                          >
                          <TagLabel>{statusOptions[research.status-1].status}</TagLabel>
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
                      borderRadius='8px'
                      padding='2%'
                    >
                      <Text 
                        fontSize='16px' 
                        color='#3F4254' 
                        fontWeight='bold'
                      >
                        {research.createdAt.substring(0, 10).replaceAll('-', '/')}
                      </Text>

                      <Text 
                        fontSize='16px' 
                        color='#3F4254' 
                        fontWeight='bold'
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
                      borderRadius='8px'
                      padding='2%'
                    >
                      <Text 
                        fontSize='16px' 
                        color='#3F4254' 
                        fontWeight='bold'
                      >
                        {12/*research.answers*/}
                      </Text>

                      <Text 
                        fontSize='16px' 
                        color='#3F4254' 
                        fontWeight='bold'
                      >
                        respostas
                      </Text>
                    </Box>
                  </InforContainer>
                </ResearchContainer>

                <Box 
                  width="100%"
                  height="4px"
                  backgroundColor={statusOptions[research.status-1].bottom}
                />
              </Box>
            );  
          })}
        </ResearchsContainer>
      </BodyContainer>

      <Modal 
        blockScrollOnMount={false} 
        isOpen={isOpenResearch} 
        onClose={onCloseResearch}
        scrollBehavior={'inside'}
        size={'4xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton 
            onClick={handleClearModal}
          />
          <ModalBody>
            <AddResearchContainer>
              <InputGroup 
                size='md' 
                marginTop='14px'
                display='flex'
                flexDir='column'
              >
                <label
                  className='img-icon'
                  htmlFor='research-icon'
                >
                  <input
                    style={{display: 'none'}}
                    type='file'
                    id='research-icon'
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleInputChange(e.target.files);
                      }
                    }}
                  />

                  <MdOutlineAddCircle color="#20D489" />
                  
                  {!hasImg ? (
                    <Text
                      fontSize='18px' 
                      color='#3F4254'
                    >
                      Adicionar ícone
                    </Text>
                  ) : (
                    <Text
                      fontSize='18px' 
                      color='#3F4254'
                    >
                      {icon.file.name}
                    </Text>
                  )}
                  
                </label>

                <Input
                  placeholder='Nome'
                  isInvalid={invalidName}
                  value={name}
                  onChange={handleChangeName}
                  pr='4.5rem'
                  type='text'
                  marginBottom='16px'
                  />

                <Input
                  placeholder='Link do termo de consentimento'
                  value={linkTerm}
                  onChange={handleChangeLinkTerm}
                  pr='4.5rem'
                  type='text'
                  marginBottom='16px'
                  />

                <Box
                  marginBottom='16px'
                >
                  <CKEditor
                    editor={ ClassicEditor }
                    data={description}
                    onFocus={() => {
                      if (description === '<p>Descrição e termo de  consentimento</p>')
                        setDescription('');
                    }}
                    onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setDescription(data);
                  } }
                  />
                </Box>
                
                <Box>
                  <CKEditor
                    editor={ ClassicEditor }
                    data={finalMessage}
                    onFocus={() => {
                      if (finalMessage === '<p>Mensagem final</p>')
                        setFinalMessage('');
                    }}
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
            display='flex'
            justifyContent='space-between'
          >
            <Button 
              backgroundColor={'#F5F8FA'}
              color={'#7E8299'}
              mr={3}
              onClick={handleClearModal}
            >
              Voltar
            </Button>

            {isEdit ? (
              <Button 
                backgroundColor={'#00A3FF'}
                color={'white'}
                mr={3}
                onClick={handleEditForm}
              >
                Editar questões
              </Button>
            ) : (
              <Button 
                backgroundColor={'#00A3FF'}
                color={'white'}
                mr={3}
                onClick={handleSubmitForm}
              >
                Próximo
              </Button>
            )}
            
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal blockScrollOnMount={false} isOpen={isOpenShareResearch} onClose={onCloseShareResearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text 
              fontSize='16px' 
              color='#3F4254'
            >
              Compartilhe este código com os participantes de sua pesquisa!
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
              {shareLink}
            </Text>
          </ModalBody>

          <ModalFooter 
            display='flex'
            justifyContent='center'
          >
            <Button 
              backgroundColor={'#F5F8FA'}
              color={'#7E8299'}
              mr={3}
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
