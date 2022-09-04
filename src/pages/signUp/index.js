import React, {useState} from "react";

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
import { icons } from "react-icons";

const SignUp = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = useState(false);
  
  const handleClick = () => setShow(!show);

  const handleChangeName = (event) => setName(event.target.value);

  const handleChangeEmail = (event) => setEmail(event.target.value);

  const handleChangePassword = (event) => setPassword(event.target.value);

  const handleSubmitForms = () => {
    alert('Usuário cadastrado!');
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
