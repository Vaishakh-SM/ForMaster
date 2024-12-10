import Resolver from "@forge/resolver";
import { propertyGetIssueProperty, addComment } from "../api";

const resolver = new Resolver();

resolver.define("getIssueProperty", ({ payload, context }) => {
  return propertyGetIssueProperty(context.extension.issue.key);
});

resolver.define("addComment", ({ payload, context }) => {
  return addComment(context.extension.issue.key, payload.commentText);
});

export const handler = resolver.getDefinitions();
