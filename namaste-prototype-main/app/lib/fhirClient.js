import FhirClient from "fhir-kit-client";

const client = new FhirClient({
  baseUrl: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/", // Epic Sandbox base
  // For secured endpoints, you’ll also need OAuth2 tokens here
});

export default client;
