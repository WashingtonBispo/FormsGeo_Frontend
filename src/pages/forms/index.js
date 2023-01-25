import React, { useCallback, useEffect, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import jwt_decode from 'jwt-decode';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { ExportToCsv } from 'export-to-csv';

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

import Select from 'react-select'

import { MdOutlineAddCircle } from 'react-icons/md';
import { AiFillFolder, AiFillFolderOpen } from 'react-icons/ai';

import getValidationErrors from '../../utils/getValidationErrors';

import { 
  adminOptionsPreview, 
  userOptionsPreview,
  adminOptionsPreTeste, 
  userOptionsPreTeste, 
  adminOptionsActive, 
  userOptionsActive, 
  adminOptionsFinal, 
  userOptionsFinal, 
  filedOptions,
  statusOptions
} from '../../utils/form';

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
  const [filed, setFiled] = useState(false);
  const [numberQuestions, setNumberQuestions] = useState(5);
  const [geolocations, setGeolocations] = useState(null);

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
        response = await api.get('Form/List', { params: { filter: filter, archived: filed } });
      else
        response = await api.get('Form/List', { params: { email: email, filter: filter, archived: filed } });

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
  }, [showErrorToast, isAdmin, filed])

  useEffect(() => {
    const decoded = jwt_decode(token);
    
    setEmail(decoded.email);
    
    if(decoded.role === "Admin"){
      setIsAdmin(true);
      getResearchs();
    }
    else 
    {
      getResearchs(decoded.email);
    }

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

    setNumberQuestions(research.numberQuestions);
    setResearchId(id);
    setHasImg(true);
    setIcon(research.icon);
    setName(research.name);
    setLinkTerm(research.linkConsent);
    setDescription(research.description);
    setFinalMessage(research.finalMessage);
    setGeolocations(research.geolocations);
  }

  const handleClearModal = () => {
    onCloseResearch();
    setNumberQuestions(5);
    setHasImg(false);
    setIcon(null);
    setName('');
    setLinkTerm('');
    setDescription('<p>Descrição e termo de  consentimento</p>');
    setFinalMessage('<p>Mensagem final</p>');
  }

  const handleQuestionsType = (question) => {
    
    if(question.type === 4){
      let nha = "";
      for(let i=0;i<question.answers.length;i++){
        nha = nha + question.answers[i] + (i=== question.answers.length-1 ? "" : ",")
      }
      return nha
    }
    else{
      return question.answers.toString()
    }
  }

  const handleExportData = (id) => {
    const exportData = async (id) => {
      let questionary = await api.get('Form?formId=' + id);
      let answers = await api.get('Answer?formId=' + id);

      //let questions = JSON.parse(questionary.data.questions)
      
      let data = []
      for(let i =0 ; i < answers.data.length; i++){
        let answer = JSON.parse(answers.data[i].answer);
        data[i] = {
          "geolocation": answers.data[i].geolocation
        }
        
        for(let j=0;j< answer.length;j++){
          data[i][(j+1).toString()] = handleQuestionsType(answer[j])
        }
      }


      const options = {
        fieldSeparator: ';',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };

      const csvExporter = new ExportToCsv(options);

      csvExporter.generateCsv(data);



    }

    exportData(id);
  };

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
        if (!isAdmin)
          softDeleteResearch(id);
        else
          deleteResearch(id);
        break;
      case 'Duplicar':
        copyResearch(id);
        break;
      case 'Arquivar':
        changeStatusResearch(id, 2);
        break;
      case 'PreTeste':
        changeStatusResearch(id, 5);
        break;
      case 'Exportar':
        handleExportData(id);
        break;
      default:
        return;
    }
  };

  const softDeleteResearch = (id) => {
    const HandleResearch = async (id) => {
      try{ 
        await api.delete('Form?formId=' + id);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast('Ocorreu um erro ao remover a pesquisa.');
      }
    }
    
    HandleResearch(id);
  }

  const copyResearch = (id) => {
    const HandleResearch = async (id) => {
      try{
        const researchData = {
          formId: id
        };
        
        await api.post('Form/Duplicate'  , researchData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast('Ocorreu um erro ao duplicar a pesquisa.');
      }
    }
    HandleResearch(id);
  }

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
        showErrorToast('Ocorreu um erro ao atualizar a pesquisa.');
      }
    }
    HandleResearch(id, status);
  }

  const deleteResearch = (id) => {
    console.log(id)
    const HandleResearch = async (id) => {
      try{ 
        await api.delete('Form?formId=' + id);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast('Ocorreu um erro ao remover a pesquisa.');
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
            numberQuestions: numberQuestions,
            isEdit: true,
            formId: researchId,
            questions: researchQuestions,
            geolocations: geolocations
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

  const handleFormOptions = (research) => {
    let option = filedOptions;

    if (filed){
      option = filedOptions;
    }
    else{
      switch(research.status){
        case 1:
          option = isAdmin ? adminOptionsActive : userOptionsActive;
          break;
        case 2:
          option = filedOptions;
          break;
        case 3:
          option = isAdmin ? adminOptionsFinal : userOptionsFinal;
          break;
        case 4:
          option = isAdmin ? adminOptionsPreview : userOptionsPreview;
          break;
        case 5:
          option = isAdmin ? adminOptionsPreTeste : userOptionsPreTeste;
          break;
        default:
          option = filedOptions;
      }
    }

    const theme = (theme) => ({
      ...theme,
      spacing: {
        ...theme.spacing,
        controlHeight: 35,
        baseUnit: 2
      }
    });

    return (
      <Select
        className='basic-single'
        placeholder='Opções'
        onChange={(e) => {researchOptionHandle(e, research.idForm)}}
        options={option}
        theme={theme}
      />
    );    
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
        <InputGroup 
          width="40%"
        >
          <Input
            value={searchInfor}
            onChange={handleChangeSearchInfor}
            placeholder='Buscar pesquisas'
            backgroundColor='#DDDDDD'
            pr='4.5rem'
            type='text'
            />
        </InputGroup>

        {filed ? (
          <Button 
            backgroundColor={'#DDDDDD'}
            color={'black'}
            mr={3}
            marginLeft="20px"
            leftIcon={<AiFillFolderOpen />}
            onClick={() => {setFiled(false)}}
          >
            Pesquisas
          </Button>
        ) : (
          <Button 
            backgroundColor={'#DDDDDD'}
            color={'black'}
            mr={3}
            marginLeft="20px"
            leftIcon={<AiFillFolder />}
            onClick={() => {setFiled(true)}}
          >
            Arquivados
          </Button>
        )}
        
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
                      {handleFormOptions(research)}
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
                      minHeight='50px'
                      maxHeight='50px'
                      overflowY='hidden'
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
                          {research.author}
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
                    onInit={(editor) => {
                      // You can store the "editor" and use when it is needed.
                      // console.log("Editor is ready to use!", editor);
                      editor.editing.view.change((writer) => {
                      writer.setStyle(
                          "height",
                          "1000px",
                          editor.editing.view.document.getRoot()
                      );
                      });
                    }}
                    onFocus={() => {
                      if (description === '<p>Descrição e termo de  consentimento</p>')
                        setDescription('');
                    }}
                    onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setDescription(data);
                    }}
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
              onClick={onCloseShareResearch}
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
