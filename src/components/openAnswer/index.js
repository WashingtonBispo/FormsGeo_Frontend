import React, { useEffect, useState } from 'react';

import { 
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

import {
  QuestionContainer,
  QuestionOptionContainer
} from './styles';

import QuestionHeader from '../QuestionHeader';

const OpenAnswer = (props) => {
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;

  const handleMaxWordInput = (e) => {
    let tempQuestionList = questionsList.map(q => q);

    tempQuestionList[index].alternatives[0] = e;

    setQuestionsList(tempQuestionList);
  }

  return (
    <>
      <QuestionContainer>
        <QuestionHeader 
          name={"Resposta aberta"}
          questionsList={questionsList} 
          setQuestionsList={setQuestionsList} 
          index={index} 
        />

        <QuestionOptionContainer>
          <Text 
            fontSize='16px' 
            color="#3F4254"
          >
            Digite o numero máximo de palavras para o campo de resposta:
          </Text>

          <NumberInput 
            onChange={e => handleMaxWordInput(e)}
            defaultValue={questionsList[index].alternatives[0]} 
            min={1}
            clampValueOnBlur={false}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </QuestionOptionContainer>
      </QuestionContainer>
    </>
  );
};

export default OpenAnswer;