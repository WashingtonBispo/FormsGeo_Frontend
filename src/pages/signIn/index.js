import React, {useState} from "react";
import { Link } from "react-router-dom";

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
  const [show, setShow] = useState(false);
  
  const handleClick = () => setShow(!show);

  const handleChangeEmail = (event) => setEmail(event.target.value);

  const handleChangePassword = (event) => setPassword(event.target.value);

  const validateUserInfor = (data) => {
    if (data.email == null || data.email == "") {
      alert("usuário inválido2");
      return true;
    }else if (data.password == null || data.password == "") {
      alert("usuário inválido3");
      return true;
    }

    return false;
  }

  const handleSubmitForms = () => {
    const AuthUser = async () => {
      const userData = {
        email,
        password
      };

      if(validateUserInfor(userData)) return;
  
      var token = await api.get("User", { params: { Email: userData.email, Password: userData.password } });

      console.log(token);
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
        <img src={bg} />
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
