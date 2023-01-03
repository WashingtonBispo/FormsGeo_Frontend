import React, {useCallback, useEffect, useState} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast, useDisclosure } from '@chakra-ui/react'

import {
  Box,
  useColorModeValue,
  Text,
  Tag,
  TagLabel,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

import { AiFillFileAdd } from 'react-icons/ai'
import { FaTrashAlt  } from 'react-icons/fa'
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill } from 'react-icons/bs'

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";
import OpenAnswer from "../../components/openAnswer";
import QuestionMultiple from "../../components/QuestionMultiple";
import AncLikert from "../../components/ancLikert";
import Likert from "../../components/likert";

import { api } from '../../services/api';

import {
  BodyContainer,
  QuestionsListContainer,
  AddQuestionContainer,
  AddQuestionBody,
  ButtonIconContainer,
  AddQuestionButtonContainer
} from './styles';

const Questions = () => {
  const questionTypes = [
    "Resposta aberta",
    "Escala likert ancorada",
    "Escala likert ancorada nas pontas",
    "Múltipla escolha",
    "Caixas de seleção"
  ]

  const [questionMultipleAlternative, setQuestionMultipleAlternative] = useState('');
  const [questionMultipleIndexAlternative, setQuestionMultipleIndexAlternative] = useState('');
  const [invalidQuestionMultipleAlternative, setInvalidQuestionMultipleAlternative] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [pageItens, setPageItens] = useState(5);
  const [showedQuestion, setShowedQuestion] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { state } = useLocation();
  const navigate = useNavigate();
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

  const updateFormQuestions = useCallback(() => {
    try
    {
      const questionsJSON = JSON.stringify(questionsList);
      
      const updateForm = async () => {
        const putData = {
          formId: state.formId,
          numberQuestions: pageItens,
          questions: questionsJSON
        }
        
        await api.put('Form', putData);
      };
    
      updateForm();
    } 
    catch
    {
      showErrorToast("Não foi possível atualizar o formulário!");
    }
  }, [questionsList, state, showErrorToast, pageItens]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      updateFormQuestions();
    }, 7000);
    return () => clearInterval(interval);
  }, [updateFormQuestions]);

  useEffect(() => {
    if (state.isEdit){
      const questions = JSON.parse(state.questions);
      setPageItens(state.numberQuestions);
      
      if (questions.length > 0) setQuestionsList(questions);
    }
  }, [state]);

  const addQuestion = (type) => {
    let tempQuestionList = questionsList.map(q => q);
    let questionData;

    switch(type)
    {
      case 0:
        questionData = getOpenAnswerQuestion();
        break;

      case 1:
        questionData = getLikertQuestion();
        break;

      case 2:
        questionData = getAncLikertQuestion();
        break;

      case 3:
        questionData = getMultipleChoiceQuestion();
        break;

      case 4:
        questionData = getSelectionBoxQuestion();
        break;
      
      default:
        return;
    }

    tempQuestionList = [...tempQuestionList, questionData]

    setQuestionsList(tempQuestionList);

    setShowedQuestion(tempQuestionList.length - 1);
  }

  const changeShowedQuestion = (index) => {
    setQuestionMultipleIndexAlternative('');
    setQuestionMultipleAlternative('');
    setInvalidQuestionMultipleAlternative(false);
    setShowedQuestion(index - 1);
  }

  const getOpenAnswerQuestion = () => {
    return {
      index: questionsList.length+1,
      question: "",
      alternatives: [1],
      type: 0
    }
  }

  const getLikertQuestion = () => {
    return {
      index: questionsList.length+1,
      question: "",
      alternatives: [],
      type: 1
    }
  }

  const getAncLikertQuestion = () => {
    return {
      index: questionsList.length+1,
      question: "",
      alternatives: ["", "", "1", 2, 0, 0],
      type: 2
    }
  }

  const getMultipleChoiceQuestion = () => {
    return {
      index: questionsList.length+1,
      question: "",
      alternatives: [],
      type: 3
    }
  }

  const getSelectionBoxQuestion = () => {
    return {
      index: questionsList.length+1,
      question: "",
      alternatives: [],
      type: 4
    }
  }

  const swapUpQuestion = (i) => {
    if (i > 1){
      i--;

      let tempQuestionList = questionsList.map(q => q);

      // swap index
      tempQuestionList[i].index--;
      tempQuestionList[i - 1].index++;

      // swap question
      var tempQuestion = tempQuestionList[i];
      tempQuestionList[i] = tempQuestionList[i - 1];
      tempQuestionList[i - 1] = tempQuestion;

      setQuestionsList(tempQuestionList);
    }
  }

  const swapDownQuestion = (i) => {
    if (i < questionsList.length){
      i--;
      
      let tempQuestionList = questionsList.map(q => q);
      
      // swap index
      tempQuestionList[i].index++;
      tempQuestionList[i + 1].index--;
      
      // swap question
      var tempQuestion = tempQuestionList[i];
      tempQuestionList[i] = tempQuestionList[i + 1];
      tempQuestionList[i + 1] = tempQuestion;
      
      setQuestionsList(tempQuestionList);
    }
  }

  const deleteQuestion = (i) => {
    let tempQuestionList = questionsList.map(q => q);

    tempQuestionList.splice(i-1, 1);

    if (tempQuestionList.length > 0){
      let newIndex = 1;
      
      tempQuestionList.forEach(q => q.index = newIndex++)
    }

    setShowedQuestion(0);

    setQuestionsList(tempQuestionList);
  } 

  const renderQuestion = () => {
    switch(questionsList[showedQuestion].type)
    {
      case 0:
        return (
          <OpenAnswer 
            questionsList={questionsList} 
            setQuestionsList={setQuestionsList} 
            index={showedQuestion}
          />);

      case 1:
        return (<Likert 
            questionsList={questionsList} 
            setQuestionsList={setQuestionsList} 
            index={showedQuestion}
            alternative={questionMultipleAlternative}
            setAlternative={setQuestionMultipleAlternative}
            invalidAlternative={invalidQuestionMultipleAlternative}
            setInvalidAlternative={setInvalidQuestionMultipleAlternative}
            indexAlternative={questionMultipleIndexAlternative}
            setIndexAlternative={setQuestionMultipleIndexAlternative}
            />);

      case 2:
        return (<AncLikert 
            questionsList={questionsList} 
            setQuestionsList={setQuestionsList} 
            index={showedQuestion} 
          />);

      case 3:
        return (<QuestionMultiple 
            questionsList={questionsList} 
            setQuestionsList={setQuestionsList} 
            index={showedQuestion} 
            title={"Múltipla escolha"}
            alternative={questionMultipleAlternative}
            setAlternative={setQuestionMultipleAlternative}
            invalidAlternative={invalidQuestionMultipleAlternative}
            setInvalidAlternative={setInvalidQuestionMultipleAlternative}
            indexAlternative={questionMultipleIndexAlternative}
            setIndexAlternative={setQuestionMultipleIndexAlternative}
          />);

      case 4:
        return (<QuestionMultiple 
            questionsList={questionsList} 
            setQuestionsList={setQuestionsList} 
            index={showedQuestion} 
            title={"Caixa de seleção"}
            alternative={questionMultipleAlternative}
            setAlternative={setQuestionMultipleAlternative}
            invalidAlternative={invalidQuestionMultipleAlternative}
            setInvalidAlternative={setInvalidQuestionMultipleAlternative}
            indexAlternative={questionMultipleIndexAlternative}
            setIndexAlternative={setQuestionMultipleIndexAlternative}
          />);
      
      default:
        return (<></>);
    }
  }

  const truncateString = (phrase, maxSize) => {
    if (phrase.length > maxSize)
      return phrase.substring(0, maxSize) + '...';
    else
      return phrase.substring(0, maxSize);
  };

  return (
    <>
      <Header />

      <CurrentRoute name={"Cadastro de Formulário"} route={"Pesquisas  /  Cadastro de Formulário"}/>
      
      <BodyContainer>
        <Box
          w={'33%'}
          h={'70%'}
          bg={color}
          boxShadow={'2xl'}
          padding= "2%"
          borderRadius="12px"
          margin="0 auto"
        >
          <Text 
            fontSize='16px' 
            color="#3F4254" 
            marginLeft="8px"
            >
            Digite a quantidade de questões presentes em uma página do dispositivo móvel:
          </Text>

          <NumberInput 
            onChange={e => setPageItens(e)}
            value={pageItens}
            min={1} 
            max={20} 
            clampValueOnBlur={false}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Box
            margin="12px 0"
            display="flex"
            alignItems="center"
            justifyContent="right"
          >
            <Text 
              fontSize='18px' 
              color="#3F4254" 
              marginRight="8px"
              >
              Cadastrar questão:
            </Text>
          
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='AddQuestion'
                icon={<AiFillFileAdd />}
                variant='outline'
                color={"#50CD89"}
                />
              <MenuList>
                <MenuItem
                  onClick={() => {addQuestion(0)}}
                >
                  Resposta aberta
                </MenuItem>

                <MenuItem
                  onClick={() => {addQuestion(1)}}
                >
                  Escala likert ancorada
                </MenuItem>

                <MenuItem
                  onClick={() => {addQuestion(2)}}
                >
                  Escala likert ancorada nas pontas
                </MenuItem>

                <MenuItem
                  onClick={() => {addQuestion(3)}}
                >
                  Múltipla escolha
                </MenuItem>

                <MenuItem
                  onClick={() => {addQuestion(4)}}
                >
                  Caixa de seleção
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <QuestionsListContainer>
            {questionsList.map((question) => {
              return (
                <Box 
                  key={question.index}
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="6px 4%"
                >
                  <Tag 
                    onClick={() => {changeShowedQuestion(question.index)}}
                    cursor="pointer"
                    size={'md'} 
                    key={'md'} 
                    variant='subtle'
                    backgroundColor={'#F1FAFF'}
                    color={'#00A3FF'}
                    >
                    <TagLabel>{question.index}</TagLabel>
                  </Tag>

                  <Text 
                    onClick={() => {changeShowedQuestion(question.index)}}
                    cursor="pointer"
                    fontSize='18px' 
                    color="#3F4254" 
                    marginLeft="8px"
                    maxWidth="190px"
                    textAlign="center"
                    >
                    {question.question === '' ? questionTypes[question.type] : truncateString(question.question, 10)}
                  </Text>

                  <ButtonIconContainer>
                    <IconButton
                      onClick={() => {swapUpQuestion(question.index)}}
                      marginLeft={'4px'}
                      aria-label='UpQuestion'
                      icon={<BsFillArrowUpSquareFill />}
                      variant='outline'
                      color="#00A3FF" 
                    />
                    
                    <IconButton
                      onClick={() => {swapDownQuestion(question.index)}}
                      marginLeft={'4px'}
                      aria-label='DownQuestion'
                      icon={<BsFillArrowDownSquareFill />}
                      variant='outline'
                      color="#00A3FF"
                    />
                    
                    <IconButton
                      onClick={() => {deleteQuestion(question.index)}}
                      marginLeft={'4px'}
                      aria-label='DeleteQuestion'
                      icon={<FaTrashAlt />}
                      variant='outline'
                      color="#F1416C"
                    />
                  </ButtonIconContainer>
                </Box>
              );
            })}
          </QuestionsListContainer>
        </Box>

        <Box
          w={'63%'}
          h={'70%'}
          bg={color}
          boxShadow={'2xl'}
          padding= "2%"
          borderRadius="12px"
          margin="0 auto"
        >
          <AddQuestionContainer>
            <AddQuestionBody>
              {questionsList.length === 0 ? (
                <></>
              ) : (
                renderQuestion()
              )}
            </AddQuestionBody>

            <AddQuestionButtonContainer>
              <Button 
                backgroundColor={'#F5F8FA'}
                color={'#7E8299'}
                marginTop={'24px'} 
                size='md'
                onClick={() => {
                  updateFormQuestions();
                  navigate('/');
                }}
              >
                Voltar
              </Button>

              <Button
                onClick={onOpen}
                backgroundColor={'#00A3FF'}
                color={'white'}
                marginTop={'24px'} 
                size='md'
              >
                Próximo
              </Button>
            </AddQuestionButtonContainer>
          </AddQuestionContainer>
        </Box>
      </BodyContainer>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
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
              Deseja seguir para as funcionalidades de geolocalização ou salvar o formulário?
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

            <Button
              onClick={() => {
                updateFormQuestions();
                navigate("/");
              }}
              backgroundColor={'#00A3FF'}
              color={'white'}
              mr={3}
            >
              Salvar
            </Button>

            <Button
              onClick={() => {
                navigate("/geografia");
              }}
              backgroundColor={'#00A3FF'}
              color={'white'}
              mr={3}
            >
              Próximo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Questions;