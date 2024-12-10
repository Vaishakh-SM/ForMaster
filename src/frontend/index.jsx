import React, { useMemo } from "react";
import ForgeReconciler from "@forge/react";
import api, { route } from "@forge/api";
import {
  Box,
  Range,
  Button,
  ButtonGroup,
  CheckboxGroup,
  RadioGroup,
  Text,
  TextArea,
  Textfield,
  Form,
  useForm,
  Select,
  DatePicker,
  UserPicker,
  FormSection,
  Stack,
  FormHeader,
  FormFooter,
  useIssueProperty,
  useProductContext,
  RequiredAsterisk,
  Label
} from "@forge/react";

import { parseEmbeddedJSON } from "./utils";

const componentsMap = {
  Range,
  RadioGroup,
  CheckboxGroup,
  Select,
  DatePicker,
  TextArea,
  Textfield,
  UserPicker,
};

const RenderFromJSON = ({ componentData }) => {
  const { component, props } = componentData;
  const Component = componentsMap[component]; // Look up the component

  if (!Component) {
    return <div>Unknown component: {component}</div>;
  }

  return <Component {...props} />;
};

const App = () => {
  const [issueFormText, setIssueFormText, deleteIssueFormText] =
    useIssueProperty("issueForm", 'asfd');

  const context = useProductContext();

  const onSubmit = (data) => {
    const issueKey = context.platformContext.issueKey;
    const bodyData = `{
      "body": "${JSON.stringify(data)}",
      "visibility": {
        "identifier": "Administrators",
        "type": "role",
        "value": "Administrators"
      }
    }`;

    const response = api
      .asUser()
      .requestJira(route`/rest/api/2/issue/${issueKey}/comment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: bodyData,
      });
  };

  const parsedIssueFormText = useMemo(() => {
    //return parseEmbeddedJSON(issueFormText);
  }, [issueFormText]);



  const testInput = `
  [
    {
      "component": "Select",
      "props": {
        "appearance": "subtle",
        "options": [
          { "label": "React", "value": "react" },
          { "label": "Node.js", "value": "node" },
          { "label": "Python", "value": "python" }
        ],
        "label": "Technology Used"
      }
    }
  ]
  `;

  const updateIssueProperty = async () => {
    await setIssueFormText(testInput);
  };

  // const parsedIssueFormText = parseEmbeddedJSON(issueFormText);
  
  if (!parsedIssueFormText) {
    return <></>;
  }
  const { handleSubmit, register, getFieldId } = useForm();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Dynamic Form">
      {/* <Button onClick={updateIssueProperty}>{`Random number: ${issueFormText}`}</Button> */}
        <Text>
          {issueFormText}
          Required fields are marked with an asterisk. <RequiredAsterisk />
        </Text>
      </FormHeader>

      {/* <FormSection>
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
        <ButtonGroup>
          <Button type="submit" appearance="primary">
            Submit
          </Button>
        </ButtonGroup>
      </FormFooter> */}
    </Form>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
