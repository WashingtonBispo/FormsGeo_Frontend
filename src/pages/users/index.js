import React from "react";
import { 
  Tag,
  TagLabel,
  Text
} from '@chakra-ui/react'
import {
  Select,
} from "chakra-react-select";

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";

import {
  UserContainer,
  UsersContainer,
  UserInfor,
  UserOptions,
  BodyContainer
} from './styles';

const users = [
    {
      status: "Ativo",
      name: "dogao",
      email: "dog@email.com"
    },
    {
      status: "Inativo",
      name: "dogao2",
      email: "dog2@email.com"
    },
    {
      status: "Inativo",
      name: "dogao3",
      email: "dog3@email.com"
    }
  ];

const Users = () => {
  const userOptionHandle = (e, email) => {
    switch(e.value){
      case "Ativar":
        enableUser(email);
        break;
      case "Desativar":
        disableUser(email);
        break;
      case "Deletar":
        deleteUser(email);
        break;
    }
  };

  const enableUser = (email) => {

  };

  const disableUser = (email) => {

  };

  const deleteUser = (email) => {

  };

  return (
    <>
      <Header />

      <CurrentRoute name={"Usuários"} route={"Usuários"}/>
      
      <BodyContainer>
        <UsersContainer>
          <Text 
            fontSize='18px' 
            color="#3F4254" 
            marginLeft="8px"
            fontWeight="bold"
          >
            Usuários
          </Text>
          
          <div className="BorderUserContainer">
            {users.map((user) => {
              return (
                <UserContainer>
                  <UserInfor>
                    <Tag 
                      size={"md"} 
                      key={"md"} 
                      variant='subtle' 
                      color={user.status == "Ativo" ? '#62DBA9' : '#F64E60'}
                      marginRight='15px'
                      >
                      <TagLabel>{user.status}</TagLabel>
                    </Tag>

                    <p1>{user.email}</p1>
                  </UserInfor>

                  <UserOptions>
                    <Select
                      className="basic-single"
                      placeholder="Opções"
                      onChange={(e) => {userOptionHandle(e, user.email)}}
                      options={[
                        {
                          label: "Ativar",
                          value: "Ativar",
                        },
                        {
                          label: "Desativar",
                          value: "Desativar",
                        },
                        {
                          label: "Deletar",
                          value: "Deletar"
                        }
                      ]}
                      />
                  </UserOptions>
                </UserContainer>
              );
            })}
          </div>
          
        </UsersContainer>
      </BodyContainer>
    </>
  );
};

export default Users;
