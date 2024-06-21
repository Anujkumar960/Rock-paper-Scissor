import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Select,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";

export const GameDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [playerVal, setPlayerVal] = useState(null);
  const [computerVal, setComputerVal] = useState(null);
  const [history, setHistory] = useState([]);
  const userInputRef = useRef();

  const logic = (playerVal, computerVal) => {
    if (playerVal === computerVal) {
      return 0;
    } else if (
      (playerVal === "ROCK" && computerVal === "SCISSORS") ||
      (playerVal === "SCISSORS" && computerVal === "PAPER") ||
      (playerVal === "PAPER" && computerVal === "ROCK")
    ) {
      return 1;
    } else {
      return -1;
    }
  };

  const addUser = async (name) => {
    if (name && !users.some((user) => user.name === name)) {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
        const newUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, { name: newUser.name, score: newUser.score }]);
        setCurrentUser(newUser.name);
      } catch (error) {
        console.error('Failed to add user', error);
      }
    }
  };

  const decision = async (playerChoice) => {
    const choices = ["ROCK", "PAPER", "SCISSORS"];
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    const val = logic(playerChoice, compChoice);

    try {
      const response = await fetch('http://localhost:3000/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: currentUser,
          playerChoice,
          computerChoice: compChoice,
          result: val,
        }),
      });
      const newHistory = await response.json();

      const updatedUsers = users.map((user) => {
        if (user.name === currentUser && val === 1) {
          return { ...user, score: user.score + 1 };
        }
        return user;
      });

      setPlayerVal(playerChoice);
      setComputerVal(compChoice);
      setUsers(updatedUsers);
      setHistory((prevHistory) => [...prevHistory, newHistory]);
    } catch (error) {
      console.error('Failed to save game history', error);
    }
  };

  return (
    <Container maxW="container.md" p={5}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Welcome to Rock, Paper, Scissors Game
      </Heading>
      <Box mb={4}>
        <Input
          placeholder="Enter user name"
          ref={userInputRef}
          mb={2}
          borderColor="teal.500"
          focusBorderColor="teal.600"
        />
        <Button
          onClick={() => addUser(userInputRef.current.value)}
          colorScheme="teal"
          mt={2}
          width="100%"
        >
          Add User
        </Button>
      </Box>
      <Box mb={4}>
        <Select
          placeholder="Select User"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
          borderColor="teal.500"
          focusBorderColor="teal.600"
        >
          {users.map((user, index) => (
            <option key={index} value={user.name}>
              {user.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box mb={4} textAlign="center">
        <Button
          onClick={() => decision("ROCK")}
          leftIcon={<FaHandRock />}
          colorScheme="red"
          mr={2}
          size="lg"
        >
          Rock
        </Button>
        <Button
          onClick={() => decision("PAPER")}
          leftIcon={<FaHandPaper />}
          colorScheme="blue"
          mr={2}
          size="lg"
        >
          Paper
        </Button>
        <Button
          onClick={() => decision("SCISSORS")}
          leftIcon={<FaHandScissors />}
          colorScheme="yellow"
          size="lg"
        >
          Scissors
        </Button>
      </Box>
      <Box className="content" textAlign="center" mb={4}>
        <Text fontSize="lg">Your choice: {playerVal}</Text>
        <Text fontSize="lg">Computer's choice: {computerVal}</Text>
        <Heading as="h2" size="md">
          Current User: {currentUser}
        </Heading>
      </Box>
      <Box
        className="score-dashboard"
        p={4}
        borderWidth={1}
        borderRadius="lg"
        borderColor="teal.500"
        mb={4}
      >
        <Heading as="h2" size="lg" mb={4}>
          Score Dashboard
        </Heading>
        <UnorderedList styleType="none" m={0}>
          {users.map((user, index) => (
            <ListItem key={index} mb={2}>
              <Text fontSize="lg">
                {user.name}: {user.score}
              </Text>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
      <Box
        className="history"
        p={4}
        borderWidth={1}
        borderRadius="lg"
        borderColor="teal.500"
      >
        <Heading as="h2" size="lg" mb={4}>
          Game History
        </Heading>
        <UnorderedList styleType="none" m={0}>
          {history.map((round, index) => (
            <ListItem key={index} mb={2}>
              <Text fontSize="md">
                {round.player} chose {round.playerChoice}, Computer chose {round.computerChoice}.{" "}
                {round.result === 1 ? `${round.player} won!` : round.result === -1 ? "Computer won!" : "It's a tie!"}
              </Text>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Container>
  );
};
