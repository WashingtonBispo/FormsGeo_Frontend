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

import bg from '../../assets/pages/signIn/WomanChatting.png'

const SignIn = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const [show, setShow] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    email: Yup.string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
    password: Yup.string()
      .min(8,'Senha de no minimo 8 caractéres')
      .required('Senha obrigatória'),
  });
  
  const handleClick = () => setShow(!show);

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
    const AuthUser = async () => {
      try {
        const userData = {
          email,
          password
        };
        
        await schema.validate(userData, {
          abortEarly: false,
        });
        
        const responseData = await api.get("User", { params: { Email: userData.email, Password: userData.password } });
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
          showErrorToast("Ocorreu um erro ao fazer login, cheque as credenciais.");

          return;
        }
      }
    }

    AuthUser();
  }

  return (
    <>
    <PNContainer>
      <PNImageAreaContainer>
        <h1>Forms</h1>
      </PNImageAreaContainer>
      <PNFormContainer>
        <h1>Geo</h1>
      </PNFormContainer>
    </PNContainer>
    <Container>
      <ImageAreaContainer>
        <p>Realize sua coleta de dados com geolocalização agora!</p>
        <img src={bg} alt={"Imagem do cadastro"} />
      </ImageAreaContainer>
      <FormContainer>
        <div className="LoginContainer">
          <Text fontSize='30px' color='#A7A8BB'>
            Seja Bem Vindo
          </Text>
          <div className="LoginLink">
            <Text fontSize='12px' color='#A7A8BB'>
              Primeira vez aqui? 
            </Text>
            <Link to="/cadastro">
              <Text fontSize='12px' color="#20D489">
                Crie sua conta!
              </Text>
            </Link>
          </div>
        </div>
        <div className="InputsContainer">
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
          Entrar
        </Button>
      </FormContainer>
    </Container>
    </>
  );
};

export default SignIn;
