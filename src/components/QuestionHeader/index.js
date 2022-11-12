import React, { useState } from 'react';

import { 
  Text,
  Textarea,
} from '@chakra-ui/react'

const OpenAnswer = (props) => {
  const name = props.name;
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;

  const handleQuestionInput = (e) => {
    let tempQuestionList = questionsList.map(q => q);

    tempQuestionList[index].question = e;

    setQuestionsList(tempQuestionList);
  }

  return (
    <>
        <Text 
          fontSize='20px' 
          color="#3F4254" 
          marginLeft="8px"
          marginBottom="8px"
          fontWeight="bold"
        >
          {name}
        </Text>

        <Textarea
          border="1px solid #E4E6EF !important"
          defaultValue={ !questionsList[index] ? "" : questionsList[index].question }
          onChange={e => {handleQuestionInput(e.target.value)}} 
          placeholder='Pergunta'
        />
    </>
  );
};

export default OpenAnswer;