import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from '@chakra-ui/react'

import jwt_decode from "jwt-decode";

import { 
  Input, 
  InputGroup, 
  InputRightElement, 
  Button, 
  Text,
  Icon
} from '@chakra-ui/react'

import * as Yup from 'yup';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import authAction from "../../store/action/auth";
import getValidationErrors from '../../utils/getValidationErrors'
import { api } from "../../services/api";

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";

import {
  BodyContainer,
  UserContainer,
  UserInforContainer,
  ButtonContainer
} from './styles';

const Profile = () => {
  const [name, setName] = React.useState('');
  const [pastPassword, setPastPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [invalidName, setInvalidName] = React.useState(false);
  const [invalidPastPassword, setPastInvalidPassword] = React.useState(false);
  const [invalidNewPassword, setNewInvalidPassword] = React.useState(false);
  const [show, setShow] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.authReducer.token);
  
  useEffect(() => {
    const decoded = jwt_decode(token);
    
    setName(decoded.name);
  }, [token]);

  const nameSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome obrigatório')
      .min(4, 'Nome de no minimo 8 caractéres')
  });

  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8,'Senha de no minimo 8 caractéres')
      .required('Senha obrigatória'),
    pastPassword: Yup.string()
      .min(8,'Senha de no minimo 8 caractéres')
      .oneOf([Yup.ref('newPassword')], 'Senha não confere')
      .required('Repetir senha obrigatório')
  });
  
  const handleClick = () => setShow(!show);

  const handleChangeName = (event) => setName(event.target.value);

  const handleChangePastPassword = (event) => setNewPassword(event.target.value);

  const handleChangeNewPassword = (event) => setPastPassword(event.target.value);

  const showErrorToast = (message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }

  const handleUpdatePassword = () => {
    const UpdatePasswordUser = async () => {
      try{
        const userData = {
          pastPassword,
          newPassword
        };

        await passwordSchema.validate(userData, {
          abortEarly: false,
        });
  
        const responseData = await api.put("User", userData);
        const token = responseData.data.jwt;

        dispatch(
          authAction.logIn({
            token
          })
        );
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          if (errors.pastPassword != undefined){
            showErrorToast(errors.pastPassword);
            setPastInvalidPassword(true);
          }
          else
            setPastInvalidPassword(false);

          if (errors.newPassword != undefined){
            showErrorToast(errors.newPassword);
            setNewInvalidPassword(true);
          }
          else
            setPastInvalidPassword(false);

          return;
        }else{
          showErrorToast("Ocorreu um erro ao atualizar.");

          return;
        }
      }
    }

    UpdatePasswordUser();
  }

  const handleUpdateName = () => {
    const UpdateNameUser = async () => {
      try{
        const userData = {
          name
        };

        await nameSchema.validate(userData, {
          abortEarly: false,
        });
  
        const responseData = await api.put("User", userData);
        const token = responseData.data.jwt;

        dispatch(
          authAction.logIn({
            token
          })
        );
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (errors.name != undefined){
            showErrorToast(errors.name);
            setInvalidName(true);
          }
          else
            setInvalidName(false);
            
          return;
        }else{
          showErrorToast("Ocorreu um erro ao atualizar.");

          return;
        }
      }
    }

    UpdateNameUser();
  }

  return (
    <>
      <Header />

      <CurrentRoute name={"Profile"} route={"Profile"}/>
      
      <BodyContainer>
        <UserContainer>
          <Text 
            fontSize='18px' 
            color="#3F4254" 
            marginLeft="8px"
            fontWeight="bold"
          >
            Usuários
          </Text>

          <UserInforContainer>
            <div className="InputContainer">
              <Text mb='8px'>Nome completo</Text>
              <InputGroup size='md'>
                <Input
                  isInvalid={invalidName}
                  value={name}
                  onChange={handleChangeName}
                  pr='4.5rem'
                  type='text'
                  />
              </InputGroup>
            </div>
          </UserInforContainer>

          <ButtonContainer>
            <Button 
              backgroundColor={'#20D489'}
              color={'white'}
              marginTop={'24px'} 
              size='md' 
              onClick={handleUpdateName}
            >
              atualizar
            </Button>
          </ButtonContainer>

          <UserInforContainer>
            <div className="InputContainer">  
              <Text mb='8px'>Senha anterior</Text>
              <InputGroup size='md'>
                <Input
                  isInvalid={invalidPastPassword}
                  value={pastPassword}
                  onChange={handleChangePastPassword}
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? (
                      <Icon as={AiFillEyeInvisible} />
                    ) : (
                      <Icon as={AiFillEye} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>
            <div className="InputContainer">  
              <Text mb='8px'>Nova senha</Text>
              <InputGroup size='md'>
                <Input
                  isInvalid={invalidNewPassword}
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? (
                      <Icon as={AiFillEyeInvisible} />
                    ) : (
                      <Icon as={AiFillEye} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>
          </UserInforContainer>

          <ButtonContainer>
            <Button 
              backgroundColor={'#20D489'}
              color={'white'}
              marginTop={'24px'} 
              size='md' 
              onClick={handleUpdatePassword}
            >
              atualizar
            </Button>
          </ButtonContainer>
        </UserContainer>
      </BodyContainer>
    </>
  );
};

export default Profile;
