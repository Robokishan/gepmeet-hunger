import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FormikHelpers, FormikValues, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import * as Yup from "yup";
import {
  RegistrationInput,
  useRegistrationsMutation,
} from "../generated/graphql";

const registerValidation = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const registerInitials: RegistrationInput = {
  details: "",
  name: "",
  email: "",
  password: "",
  username: "",
};

export default function Registration(): ReactElement {
  const [, register] = useRegistrationsMutation();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const router = useRouter();

  const registrationFormik = useFormik({
    onSubmit: onRegisterFormSubmit,
    validateOnBlur: false,
    validateOnChange: false,

    validationSchema: registerValidation,
    initialValues: registerInitials,
  });

  async function onRegisterFormSubmit(
    values: RegistrationInput,
    { validateForm, setSubmitting }: FormikHelpers<RegistrationInput>
  ) {
    validateForm(values);
    try {
      const { data } = await register({
        options: values,
      });
      if (data?.registration?.user?.name) {
        toast({
          title: `Registration Success`,
          description: data?.registration?.user?.name,
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        router.push("/login");
      } else if (data?.registration?.errors) {
        toast({
          title: "Login Failed!",
          description: "Something went wrong!",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Box mt={8} mx="auto" maxW="400px" w="100%">
      <form onSubmit={registrationFormik.handleSubmit}>
        <Flex flexDirection="column" gap="20px">
          <Flex justifyContent="center">
            <Text fontSize="3xl" textAlign="center">
              Registration |
            </Text>
            <Text whiteSpace="pre" fontSize="3xl">
              <Link color="teal" href="/login">
                Login
              </Link>
            </Text>
          </Flex>
          <Input
            placeholder="Please enter your name"
            name="name"
            isInvalid={!!registrationFormik.errors.name}
            onChange={registrationFormik.handleChange}
            onBlur={registrationFormik.handleBlur}
            type="text"
            id="name"
          />
          <Input
            placeholder="Please enter your Email"
            name="email"
            autoComplete="email"
            isInvalid={!!registrationFormik.errors.email}
            onChange={registrationFormik.handleChange}
            onBlur={registrationFormik.handleBlur}
            type="email"
            id="email"
          />
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Please enter your Password"
              autoComplete="password"
              isInvalid={!!registrationFormik.errors.password}
              onChange={registrationFormik.handleChange}
              onBlur={registrationFormik.handleBlur}
              name="password"
              id="password"
            />

            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Input
            placeholder="Please enter your Username"
            isInvalid={!!registrationFormik.errors.username}
            onChange={registrationFormik.handleChange}
            onBlur={registrationFormik.handleBlur}
            autoComplete="username"
            name="username"
            type="text"
            id="username"
          />

          <Textarea
            isInvalid={!!registrationFormik.errors.details}
            placeholder="Pleasae enter your Details"
            onChange={registrationFormik.handleChange}
            onBlur={registrationFormik.handleBlur}
            name="details"
            id="details"
          />

          <Button
            disabled={!registrationFormik.dirty}
            colorScheme="green"
            type="submit"
          >
            Register
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
