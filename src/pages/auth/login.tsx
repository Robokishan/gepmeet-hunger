import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { ReactElement, useContext, useState } from "react";
import * as Yup from "yup";
import { LoginInput, useLoginMutation } from "../../generated/graphql";
import { SocketContext } from "../../modules/SocketProvider";
import { CookieKeys } from "../../utils/constant";
import { getCookie, setCookie } from "../../utils/cookieManager";

const loginValidation = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const loginInitials: LoginInput = {
  email: "",
  password: "",
};

export default function Login(): ReactElement {
  const [dologin] = useLoginMutation();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const socket = useContext(SocketContext);
  const toast = useToast();

  const router = useRouter();
  const loginformik = useFormik({
    onSubmit: onLoginFormSubmit,
    validationSchema: loginValidation,
    initialValues: loginInitials,
  });

  if (getCookie(CookieKeys.token)) Router.push("/room");

  async function onLoginFormSubmit(
    values: LoginInput,
    { setSubmitting, validateForm }: FormikHelpers<LoginInput>
  ) {
    validateForm(values);
    try {
      const { data } = await dologin({
        variables: {
          options: values,
        },
      });
      if (data?.login?.user) {
        toast({
          title: `Login Success`,
          description: data.login.user.email,
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        setCookie(
          CookieKeys.token,
          data.login.user.token.access_token,
          Number(data.login.user.token.expires_in)
        );
        socket.connect();
        router.push("/room");
      } else if (data?.login?.errors) {
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
      <form onSubmit={loginformik.handleSubmit}>
        <Flex flexDirection="column" gap="20px">
          <Flex justifyContent="center">
            <Text fontSize="3xl" textAlign="center">
              Login
            </Text>
          </Flex>
          <Input
            name="email"
            placeholder="Please enter your email"
            autoComplete="email"
            onChange={loginformik.handleChange}
            onBlur={loginformik.handleBlur}
            type="email"
            id="email"
          />
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Please enter your Password"
              autoComplete="password"
              name="password"
              onChange={loginformik.handleChange}
              onBlur={loginformik.handleBlur}
              id="password"
            />

            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            isLoading={loginformik.isSubmitting}
            disabled={!loginformik.dirty || !loginformik.isValid}
            colorScheme="green"
            type="submit"
          >
            Login
          </Button>
          <Text as="u" whiteSpace="pre" fontSize="small">
            <Link color="teal" href="/registration">
              Not Registered? Register here
            </Link>
          </Text>
        </Flex>
      </form>
    </Box>
  );
}
