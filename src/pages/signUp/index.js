import React, {useState} from "react";

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

import bg from '../../assets/pages/signUp/Background.png'

const SignUp = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = useState(false);
  
  const handleClick = () => setShow(!show);

  const handleChangeName = (event) => setName(event.target.value);

  const handleChangeEmail = (event) => setEmail(event.target.value);

  const handleChangePassword = (event) => setPassword(event.target.value);

  const validateUserInfor = (data) => {
    if (data.name == null || data.name == "") {
      alert("usuário inválido1");
      return true;
    }else if (data.email == null || data.email == "") {
      alert("usuário inválido2");
      return true;
    }else if (data.password == null || data.password == "") {
      alert("usuário inválido3");
      return true;
    }

    return false;
  }

  const handleSubmitForms = () => {
    const CreateUser = async () => {
      const userData = {
        name,
        email,
        password
      };


      if(validateUserInfor(userData)) return;
  
      var user = await api.post("User", userData);

      console.log(user);
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
            <Text fontSize='12px' color="#20D489">
              Acesse por aqui!
            </Text>
          </div>
        </div>
        <div className="InputsContainer">
          <div className="InputContainer">
            <Text mb='8px'>Nome completo</Text>
            <InputGroup size='md'>
              <Input
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
