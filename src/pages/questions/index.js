import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { useToast } from '@chakra-ui/react'

import {
  Box,
  Avatar,
  useColorModeValue,
  Text,
  Tag,
  TagLabel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiFillFileAdd } from 'react-icons/ai'
import { FaTrashAlt  } from 'react-icons/fa'
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill } from 'react-icons/bs'

import authAction from "../../store/action/auth";
import getValidationErrors from '../../utils/getValidationErrors'
import { api } from "../../services/api";

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";

import {
  BodyContainer,
  QuestionsListContainer,
  AddQuestionContainer,
  AddQuestionBody,
  AddQuestionButtonContainer
} from './styles';

const Questions = () => {
  const [pageItens, setPageItens] = useState(5);
  const [show, setShow] = useState(false);

  const toast = useToast();
  const color = useColorModeValue('white', 'gray.700');
  
  useEffect(() => {
    
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Nome obrigatório')
      .min(4, 'Nome de no minimo 8 caracteres')
  });
  
  const handleClick = () => setShow(!show);

  const showErrorToast = (message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }

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
          <NumberInput 
            onChange={e => setPageItens(e)}
            defaultValue={pageItens} 
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

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='AddQuestion'
              icon={<AiFillFileAdd />}
              variant='outline'
            />
            <MenuList>
              <MenuItem command='⌘T'>
                New Tab
              </MenuItem>
              <MenuItem command='⌘N'>
                New Window
              </MenuItem>
              <MenuItem command='⌘⇧N'>
                Open Closed Tab
              </MenuItem>
              <MenuItem command='⌘O'>
                Open File...
              </MenuItem>
            </MenuList>
          </Menu>

          <QuestionsListContainer>
            <Tag 
              size={'md'} 
              key={'md'} 
              variant='subtle'
              backgroundColor={'#F1FAFF'}
              color={'#00A3FF'}
            >
              <TagLabel>1</TagLabel>
            </Tag>

            <Text 
              fontSize='18px' 
              color="#3F4254" 
              marginLeft="8px"
            >
              Resposta Aberta
            </Text>

            <IconButton
              marginLeft={'4px'}
              aria-label='UpQuestion'
              icon={<BsFillArrowUpSquareFill />}
              variant='outline'
            />
            <IconButton
              marginLeft={'4px'}
              aria-label='DownQuestion'
              icon={<BsFillArrowDownSquareFill />}
              variant='outline'
            />
            <IconButton
              marginLeft={'4px'}
              aria-label='DeleteQuestion'
              icon={<FaTrashAlt />}
              variant='outline'
            />
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
              <p>aqui</p>
            </AddQuestionBody>

            <AddQuestionButtonContainer>
              <Button 
                backgroundColor={'#F5F8FA'}
                color={'#7E8299'}
                marginTop={'24px'} 
                size='md'
              >
                Voltar
              </Button>

              <Button 
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
    </>
  );
};

export default Questions;