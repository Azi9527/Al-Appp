import React from 'react';
import { Select, Box, Text, Flex, Icon } from '@chakra-ui/react';
import useAIStore from '../../store/aiStore';

const AISelector = () => {
  const { currentAI, aiTypes, setCurrentAI } = useAIStore();

  const handleChange = (e) => {
    setCurrentAI(e.target.value);
  };

  return (
    <Box mb={4}>
      <Text mb={2} fontWeight="medium">选择AI功能：</Text>
      <Select value={currentAI} onChange={handleChange} variant="filled">
        {aiTypes.map((ai) => (
          <option key={ai.id} value={ai.id}>
            {ai.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default AISelector;