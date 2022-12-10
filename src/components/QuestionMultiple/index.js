import React from 'react';
import { useToast } from '@chakra-ui/react'

import { 
  IconButton,
  Input,
  InputGroup,
  Box,
  Text,
  Tag,
  TagLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

import * as Yup from 'yup';


import { MdAddBox } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

import {
  QuestionContainer,
  QuestionMultipleContainer
} from './styles';

import getValidationErrors from '../../utils/getValidationErrors'

import QuestionHeader from '../QuestionHeader';

const QuestionMultiple = (props) => {
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;
  const title = props.title;
  const alternative = props.alternative;
  const setAlternative = props.setAlternative;
  const invalidAlternative = props.invalidAlternative;
  const setInvalidAlternative = props.setInvalidAlternative;
  const indexAlternative = props.indexAlternative;
  const setIndexAlternative = props.setIndexAlternative;

  const toast = useToast();

  const schema = Yup.object().shape({
    value: Yup.string()
      .required('Alternativa deve conter ao menos um caractere')
  });

  const showErrorToast = (message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }

  const handleAddQuestion = () => {
    const AddQuestion = async () => {
      try{
        const alternativeData = {
          value: alternative,
          index: indexAlternative
        }
    
        await schema.validate(alternativeData, {
          abortEarly: false,
        });
        
        let tempQuestionList = questionsList.map(q => q);
      
        if (tempQuestionList[index].alternatives.length > 0)
          tempQuestionList[index].alternatives.forEach(element => {
            if(element.index == alternativeData.index) throw "error";
          });
    
        let alternativeList = [...tempQuestionList[index].alternatives, alternativeData];
    
        tempQuestionList[index].alternatives = alternativeList;

        setQuestionsList(tempQuestionList);
    
        setAlternative("");
        setIndexAlternative("");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          console.log(errors)
          if (errors.value !== undefined){
            showErrorToast(errors.value);
            setInvalidAlternative(true);
          }
          else
            setInvalidAlternative(false);

          return;
        }else{
          showErrorToast("Ocorreu um erro ao fazer o cadastro do formulário de pesquisa.");

          return;
        }
      }
      
    }

    AddQuestion();
  }

  const handleDeleteAlternative = (i) => {
    let tempQuestionList = questionsList.map(q => q);

    let alternativeList = tempQuestionList[index].alternatives;

    alternativeList.splice(i - 1, 1);

    if (alternativeList.length > 0){
      let newIndex = 1;
      
      alternativeList.forEach(q => q.index = newIndex++)
    }

    tempQuestionList[index].alternatives = alternativeList;

    setQuestionsList(tempQuestionList);
  }

  const comparIndex = (a, b) => {
    return a.index - b.index;
  }

  return (
    <>
      <QuestionContainer>
        <QuestionHeader 
          name={title}
          questionsList={questionsList} 
          setQuestionsList={setQuestionsList} 
          index={index} 
        />

        <QuestionMultipleContainer>
          <Text 
            fontSize='18px' 
            color="#3F4254"
            fontWeight="bold" 
            marginLeft="4px"
            marginBottom="12px"
          >
            Alternativas
          </Text>

          {!!questionsList[index].alternatives &&
          questionsList[index].alternatives.sort(comparIndex).map((alternative, index) => {
            return (
              <Box 
                key={index}
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="8px"
              >
                <Box
                    display="flex"
                >
                  <Tag 
                    cursor="pointer"
                    size={'md'} 
                    key={'md'} 
                    variant='subtle'
                    backgroundColor={'#F1FAFF'}
                    color={'#00A3FF'}
                    marginLeft="6px"
                    >
                    <TagLabel>{alternative.index}</TagLabel>
                  </Tag>
                  
                  <Text 
                    fontSize='18px' 
                    color="#3F4254" 
                    marginLeft="8px"
                    >
                    {alternative.value}
                  </Text>
                </Box>

                <IconButton
                  onClick={() => {handleDeleteAlternative(alternative.index)}}
                  marginLeft={'4px'}
                  aria-label='DeleteAlternative'
                  icon={<FaTrashAlt />}
                  variant='outline'
                  color="#F1416C"
                />
              </Box>
            );
          })}

          <Box
            width="100%"
            display="flex"
            marginTop="12px"
          >
            <IconButton
              onClick={handleAddQuestion}
              marginLeft={'4px'}
              aria-label='AddAlternative'
              icon={<MdAddBox />}
              variant='outline'
              color="#20D489"
              />

            <InputGroup size='md'>
              <Input
                placeholder="Adicionar indice da alternativa"
                isInvalid={invalidAlternative}
                value={indexAlternative}
                onChange={(e) => setIndexAlternative(e.target.value)}
                pr='4.5rem'
                type='number'
              />

              <Input
                placeholder="Adicionar nova alternativa"
                isInvalid={invalidAlternative}
                value={alternative}
                onChange={(e) => setAlternative(e.target.value)}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </Box>
        </QuestionMultipleContainer>
      </QuestionContainer>
    </>
  );
};

export default QuestionMultiple;