import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from '@chakra-ui/react'

import * as Yup from 'yup';

import authAction from "../../store/action/auth";
import getValidationErrors from '../../utils/getValidationErrors'
import { api } from "../../services/api";

import { 
  Input, 
  InputGroup, 
  InputRightElement, 
  Button, 
  Text,
  Icon
} from '@chakra-ui/react'

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import {
  PNContainer,
  PNFormContainer,
  PNImageAreaContainer,
  Container,
  FormContainer,
  ImageAreaContainer
} from './styles';

import bg from '../../assets/pages/signUp/WomanAndForm.png'

const SignUp = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [invalidName, setInvalidName] = React.useState(false);
  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const [show, setShow] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Nome obrigatório')
      .min(4, 'Nome de no minimo 8 caracteres'),
    email: Yup.string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
    password: Yup.string()
      .min(8,'Senha de no minimo 8 caracteres')
      .required('Senha obrigatória'),
  });
  
  const handleClick = () => setShow(!show);

  const handleChangeName = (event) => setName(event.target.value);

  const handleChangeEmail = (event) => setEmail(event.target.value);

  const handleChangePassword = (event) => setPassword(event.target.value);

  const showErrorToast = (message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }

  const handleSubmitForms = () => {
    const CreateUser = async () => {
      try{
        const userData = {
          name,
          email,
          password
        };

        await schema.validate(userData, {
          abortEarly: false,
        });
  
        const responseData = await api.post("User", userData);
        const token = responseData.data.jwt;

        dispatch(
          authAction.logIn({
            token
          })
        );

        navigate("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (errors.name != undefined){
            showErrorToast(errors.name);
            setInvalidName(true);
          }
          else
            setInvalidName(false);

          if (errors.email != undefined){
            showErrorToast(errors.email);
            setInvalidEmail(true);
          }
          else
            setInvalidEmail(false);

          if (errors.password != undefined){
            showErrorToast(errors.password);
            setInvalidPassword(true);
          }
          else
            setInvalidPassword(false);

          return;
        }else{
          showErrorToast("Ocorreu um erro ao fazer o cadastro.");

          return;
        }
      }
    }

    CreateUser();
  
  }

  return (
    <>
    <PNContainer>
      <PNFormContainer>
        <h1>Forms</h1>
      </PNFormContainer>
      <PNImageAreaContainer>
        <h1>Geo</h1>
      </PNImageAreaContainer>
    </PNContainer>
    <Container>
      <FormContainer>
        <div className="LoginContainer">
          <Text fontSize='30px' color='#A7A8BB'>
            cadastrado
          </Text>
          <div className="LoginLink">
            <Text fontSize='12px' color='#A7A8BB'>
              Já possui conta? 
            </Text>
            <Link to="/login">
              <Text fontSize='12px' color="#20D489">
                Acesse por aqui!
              </Text>
            </Link>
          </div>
        </div>
        <div className="InputsContainer">
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
          <div className="InputContainer">
            <Text mb='8px'>E-mail</Text>
            <InputGroup size='md'>
              <Input
                isInvalid={invalidEmail}
                value={email}
                onChange={handleChangeEmail}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </div>
          <div className="InputContainer">  
            <Text mb='8px'>Senha</Text>
            <InputGroup size='md'>
              <Input
                isInvalid={invalidPassword}
                value={password}
                onChange={handleChangePassword}
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
        </div>

        <Button 
          backgroundColor={'#20D489'}
          color={'white'}
          marginTop={'24px'} 
          size='md' 
          onClick={handleSubmitForms}
        >
          Cadastrar
        </Button>
      </FormContainer>
      <ImageAreaContainer>
        <p>Realize sua coleta de dados com geolocalização agora!</p>
        <img src={bg} />
      </ImageAreaContainer>
    </Container>
    </>
  );
};

export default SignUp;
