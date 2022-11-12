import React, { useState } from 'react';

import { 
  IconButton,
  Input,
  InputGroup,
  Box,
  Text
} from '@chakra-ui/react'

import { MdAddBox } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

import {
  QuestionContainer,
  SelectionBoxContainer
} from './styles';

import QuestionHeader from '../QuestionHeader';

const SelectionBox = (props) => {
  const index = props.index;
  const questionsList = props.questionsList;
  const setQuestionsList = props.setQuestionsList;

  const [alternative, setAlternative] = useState('');
  const [invalidAlternative, setInvalidAlternative] = useState(false);

  const handleAddQuestion = () => {
    const alternativeData = {
      value: alternative,
      index: !questionsList[index].alternatives ? 1 : questionsList[index].alternatives.length + 1
    }

    let tempQuestionList = questionsList.map(q => q);

    let alternativeList = [...tempQuestionList[index].alternatives, alternativeData];

    tempQuestionList[index].alternatives = alternativeList;
    
    setQuestionsList(tempQuestionList);
  }

  const handleDeleteAlternative = (i) => {

  }

  return (
    <>
      <QuestionContainer>
        <QuestionHeader 
          name={"Caixa de seleção"}
          questionsList={questionsList} 
          setQuestionsList={setQuestionsList} 
          index={index} 
        />

        <SelectionBoxContainer>
          {!!questionsList[index].alternatives &&
          questionsList[index].alternatives.map((alternative) => {
            return (
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
                placeholder="Adicionar nova opção ou adicionar opção outros"
                isInvalid={invalidAlternative}
                onChange={(e) => setAlternative(e.target.value)}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </Box>
        </SelectionBoxContainer>
      </QuestionContainer>
    </>
  );
};

export default SelectionBox;