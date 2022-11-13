import React from 'react';
import { useToast } from '@chakra-ui/react'

import { 
  IconButton,
  Input,
  InputGroup,
  Box,
  Text
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

const Likert = (props) => {
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;
  const alternative = props.alternative;
  const setAlternative = props.setAlternative;
  const invalidAlternative = props.invalidAlternative;
  const setInvalidAlternative = props.setInvalidAlternative;

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
          index: !questionsList[index].alternatives ? 1 : questionsList[index].alternatives.length + 1
        }
    
        await schema.validate(alternativeData, {
          abortEarly: false,
        });
        
        let tempQuestionList = questionsList.map(q => q);
    
        let alternativeList = [...tempQuestionList[index].alternatives, alternativeData];
    
        tempQuestionList[index].alternatives = alternativeList;
    
        setQuestionsList(tempQuestionList);
    
        setAlternative("");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          console.log(errors)
          if (errors.value != undefined){
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

  return (
    <>
      <QuestionContainer>
        <QuestionHeader 
          name={"Likert"}
          questionsList={questionsList} 
          setQuestionsList={setQuestionsList} 
          index={index} 
        />

        <QuestionMultipleContainer>
          <Text 
            fontSize='18px' 
            color="#3F4254" 
            marginLeft="8px"
            >
            Sub-pergunta
          </Text>

          {!!questionsList[index].alternatives &&
          questionsList[index].alternatives.map((alternative, index) => {
            return (
              <Box>
                <Text 
                  fontSize='18px' 
                  color="#3F4254" 
                  marginLeft="8px"
                  >
                  {index+1}º marcador
                </Text>

                <Box 
                  key={alternative.index}
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  margin="6px 0"
                  >
                  <Text 
                    fontSize='18px' 
                    color="#3F4254" 
                    marginLeft="8px"
                    >
                    {alternative.value}
                  </Text>

                  <IconButton
                    onClick={() => {handleDeleteAlternative(alternative.index)}}
                    marginLeft={'4px'}
                    aria-label='DeleteAlternative'
                    icon={<FaTrashAlt />}
                    variant='outline'
                    />
                </Box>
              </Box>
            );
          })}

          <Box
            width="100%"
            display="flex"
          >
            <IconButton
              onClick={handleAddQuestion}
              marginLeft={'4px'}
              aria-label='AddAlternative'
              icon={<MdAddBox />}
              variant='outline'
              />

            <InputGroup size='md'>
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

export default Likert;