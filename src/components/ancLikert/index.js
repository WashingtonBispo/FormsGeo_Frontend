import React from 'react';

import { 
  Input,
  InputGroup,
  Box,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio, 
  RadioGroup,
  Stack
} from '@chakra-ui/react'

import {
  QuestionContainer,
  QuestionMultipleContainer
} from './styles';

import QuestionHeader from '../QuestionHeader';

const AncLikert = (props) => {
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;

  const handleAncQuestion = (e, type) => {
    let tempQuestionList = questionsList.map(q => q);

    tempQuestionList[index].alternatives[type] = e;

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

          <Box>
            <Text 
              fontSize='18px' 
              color="#3F4254" 
              marginLeft="8px"
              >
              Âncora da esquerda
            </Text>

            <InputGroup size='md'>
              <Input
                placeholder="Adicionar nova alternativa"
                value={questionsList[index].alternatives[0]}
                onChange={(e) => handleAncQuestion(e.target.value, 0)}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </Box>

          <Box>
            <Text 
              fontSize='18px' 
              color="#3F4254" 
              marginLeft="8px"
              >
              Âncora da direita
            </Text>

            <InputGroup size='md'>
              <Input
                placeholder="Adicionar nova alternativa"
                value={questionsList[index].alternatives[1]}
                onChange={(e) => handleAncQuestion(e.target.value, 1)}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </Box>

          <RadioGroup 
            onChange={e => handleAncQuestion(e, 2)} 
            value={questionsList[index].alternatives[2]}
          >
            <Stack direction='row'>
              <Radio value='1'>Slider</Radio>
              <Radio value='2'>Marcadores</Radio>
            </Stack>
          </RadioGroup>

          {questionsList[index].alternatives[2] === "2" ? (
            <NumberInput 
              onChange={e => handleAncQuestion(e, 3)}
              value={questionsList[index].alternatives[3]} 
              min={2}
              clampValueOnBlur={false}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          ) : (
            <></>
          )}
          
        </QuestionMultipleContainer>
      </QuestionContainer>
    </>
  );
};

export default AncLikert;