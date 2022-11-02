import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

import { 
  Text
} from '@chakra-ui/react'

import {
  HeaderContainer,
  HeaderPagesContainer,
  HeaderUserContainer
} from './styles';

const Header = () => {
  const token = useSelector((state) => state.authReducer.token);
  const decoded = !!token ? jwt_decode(token) : null;

  return (
    <>
        <HeaderContainer>
          <HeaderPagesContainer>
            <Link to="/">
              <Text fontSize='18px' color="#FFFFFF" marginRight="8px">
                Pesquisas
              </Text>
            </Link>
            {decoded.role == "Admin" ? (
              <Link to="/usuarios">
                <Text fontSize='18px' color="#FFFFFF" marginRight="8px">
                  Usuários
                </Text>
              </Link>
            ) : (
              <></>
            )}
            
            <Link to="/profile">
              <Text fontSize='18px' color="#FFFFFF">
                Perfil
              </Text>
            </Link>
          </HeaderPagesContainer>
          
          <HeaderUserContainer>
            <div>
              <Text fontSize='12px' color="#FFFFFF">{decoded.name}</Text>
              <Text fontSize='12px' color="#FFFFFF">{decoded.role}</Text>
            </div>
            <label>{decoded.name.charAt(0)}</label>
          </HeaderUserContainer>
        </HeaderContainer>
    </>
  );
};

export default Header;