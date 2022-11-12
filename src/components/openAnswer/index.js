import React, { useState } from 'react';

import { 
  Text,
  Textarea,
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

const OpenAnswer = () => {
  const [question, setQuestion] = useState('');
  const [maxWords, setMaxWords] = useState(1);

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
          Resposta aberta
        </Text>

        <Textarea
          border="1px solid #E4E6EF !important"
          defaultValue={question}
          onChange={e => setQuestion(e)} 
          placeholder='Pergunta'
        />

        <QuestionOptionContainer>
          <Text 
            fontSize='16px' 
            color="#3F4254"
          >
            Digite o numero máximo de palavras para o campo de resposta:
          </Text>

          <NumberInput 
            onChange={e => setMaxWords(e)}
            defaultValue={maxWords} 
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