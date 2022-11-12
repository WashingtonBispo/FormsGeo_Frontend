import React, { useState } from 'react';

import { 
  Text,
  Textarea
} from '@chakra-ui/react'

import {
  QuestionContainer
} from './styles';

const MultipleQuestion = () => {
  const [question, setQuestion] = useState('');

  return (
    <>
      <QuestionContainer>
        <Text 
          fontSize='20px' 
          color="#3F4254" 
          marginLeft="8px"
          marginBottom="8px"
          fontWeight="bold"
        >
          Múltipla escolha
        </Text>

        <Textarea
          border="1px solid #E4E6EF !important"
          defaultValue={question}
          onChange={e => setQuestion(e)} 
          placeholder='Pergunta'
        />

      </QuestionContainer>
    </>
  );
};

export default MultipleQuestion;