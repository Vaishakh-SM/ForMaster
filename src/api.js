import api, { route } from "@forge/api";

export async function propertyGet(issueKey, propKey) {
  const url = route`/rest/api/3/issue/${issueKey}/properties/${propKey}`;

  let getresponse = await api.asApp().requestJira(url, {
    headers: {
      Accept: "application/json",
    },
  });

  let currentData = await getresponse.json();

  let fieldData;
  if (typeof currentData["value"] !== "undefined") {
    fieldData = currentData["value"];
  } else {
    fieldData = [];
  }

  return fieldData;
}

export async function addComment(issueKey, commentText) {
  const text = Object.entries(commentText)
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
    .join("\n");

  const escapedText = text.replace(/\n/g, "\\n");

  var bodyData = `{
  "body": {
    "content": [
      {
        "content": [
          {
            "text": "${escapedText}",
            "type": "text"
          }
        ],
        "type": "paragraph"
      }
    ],
    "type": "doc",
    "version": 1
  }
}`;

  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}/comment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: bodyData,
    });

  let currentData = await response.json();
  return currentData;
}

export async function propertyGetIssueProperty(issueKey) {
  return await propertyGet(issueKey, "issueForm");
}
