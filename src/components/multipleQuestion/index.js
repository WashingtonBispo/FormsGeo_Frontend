import React, { useState } from 'react';

import { 
  Text,
  Textarea
} from '@chakra-ui/react'

import {
  QuestionContainer
} from './styles';

import QuestionHeader from '../QuestionHeader';

const MultipleQuestion = (props) => {
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;

  return (
    <>
      <QuestionContainer>
        <QuestionHeader 
          name={"Múltipla escolha"}
          questionsList={questionsList} 
          setQuestionsList={setQuestionsList} 
          index={index} 
        />
      </QuestionContainer>
    </>
  );
};

export default MultipleQuestion;