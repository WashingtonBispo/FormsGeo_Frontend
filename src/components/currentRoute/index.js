import React from 'react';

import { 
  Text
} from '@chakra-ui/react'

import {
    RouteContainer
  } from './styles';

const CurrentRoute = (props) => {
  return (
    <>
      <RouteContainer>
        <Text fontSize='18px' color="#3F4254" marginLeft="8px">
            {props.name}
        </Text>

        <Text fontSize='12px' color="#3F4254" marginLeft="8px">
          {props.route}
        </Text>
      </RouteContainer>
    </>
  );
};

export default CurrentRoute;