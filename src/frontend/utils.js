function parseEmbeddedJSON(inputString) {
  try {
    // Extract JSON-like substring using a regular expression
    const jsonMatch = inputString.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in the input string.");
    }

    // Parse the extracted JSON string
    const parsedJSON = JSON.parse(jsonMatch[0]);
    return parsedJSON;
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return null;
  }
}
