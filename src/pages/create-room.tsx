import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React, { ReactElement } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreateConversationMutation } from "../generated/graphql";

interface Props {}

export default function CreateRoom({}: Props): ReactElement {
  const [createRoom] = useCreateConversationMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values) => {
          console.log(values);
          const { errors: error } = await createRoom({
            variables: { options: values },
          });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="description"
                placeholder="text..."
                label="Description"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Create Conversation
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
