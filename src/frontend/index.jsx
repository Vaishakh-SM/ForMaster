import React, { useEffect, useState, useMemo, Fragment } from "react";
import ForgeReconciler from "@forge/react";
import api, { route } from "@forge/api";
import {
  Box,
  Range,
  Button,
  ButtonGroup,
  CheckboxGroup,
  RadioGroup,
  SectionMessage,
  Text,
  TextArea,
  Textfield,
  useForm,
  Select,
  DatePicker,
  UserPicker,
  FormSection,
  Stack,
  FormHeader,
  FormFooter,
  Form,
  Label,
  RequiredAsterisk,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const componentsMap = {
  Range,
  RadioGroup,
  CheckBoxGroup: CheckboxGroup,
  Select,
  DatePicker,
  TextField: Textfield,
  TextArea,
  UserPicker,
};

const App = () => {
  const [issueFormText, setIssueFormText] = useState("");
  const [done, setDone] = useState(false);
  const [c, setC] = useState("");
  invoke("getIssueProperty").then((key) => {
    setIssueFormText(JSON.stringify(key));
  });

  const onSubmit = (data) => {
    invoke("addComment", { commentText: data }).then((resp) => {
      setC(JSON.stringify(resp));
      setDone(true);
    });
  };

  const parsedIssueFormText = useMemo(() => {
    if (issueFormText) {
      return JSON.parse(issueFormText);
    }
    return "";
  }, [issueFormText]);

  const { handleSubmit, register, getFieldId } = useForm();
  if (done) {
    return (
      <SectionMessage appearance="success">
        <Text> Your response has been recorded in the comments! 😇 {c}</Text>
      </SectionMessage>
    );
  }

  if (!parsedIssueFormText || parsedIssueFormText.length === 0) {
    return (
      <SectionMessage appearance="information">
        <Text>No form available at the moment.</Text>
      </SectionMessage>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Survey">
        Required fields are marked with an asterisk. <RequiredAsterisk />
      </FormHeader>

      <FormSection>
        <Stack space="space.200">
          {parsedIssueFormText.map((field, index) => {
            const { component, props } = field;
            const Component = componentsMap[component];

            if (!Component) {
              return (
                <Box key={index}>
                  <Text>Unsupported component: {component}</Text>
                </Box>
              );
            }

            return (
              <Box key={index}>
                {props.label && (
                  <Label labelFor={getFieldId(props.label)}>
                    {props.label} {props.isRequired && <RequiredAsterisk />}
                  </Label>
                )}
                <Component {...register(props.label)} {...props} />
              </Box>
            );
          })}
        </Stack>
      </FormSection>

      <FormFooter>
        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </FormFooter>
    </Form>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
