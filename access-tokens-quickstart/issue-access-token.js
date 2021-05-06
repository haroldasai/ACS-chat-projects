const { CommunicationIdentityClient } = require('@azure/communication-identity');

const main = async () => {
  console.log("Azure Communication Services - Access Tokens Quickstart")

  // Quickstart code goes here
  // This code demonstrates how to fetch your connection string
  // from an environment variable.
  const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
  console.log(connectionString);

  // Instantiate the identity client
  const identityClient = new CommunicationIdentityClient(connectionString);

  // Create User Identity
  let identityResponse = await identityClient.createUser();
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

  // Issue an access token with the "voip" scope for an identity
  let tokenResponse = await identityClient.getToken(identityResponse, ["chat"]);
  const { token, expiresOn } = tokenResponse;
  console.log(`\nIssued an access token with 'chat' scope that expires at ${expiresOn}:`);
  console.log(token);

  // // Value of identityResponse represents the Azure Communication Services identity stored during identity creation and then used to issue the tokens being refreshed
  //let refreshedTokenResponse = await identityClient.getToken(identityResponse, ["chat"]);

  //await identityClient.revokeTokens(identityResponse);
  //console.log(`\nSuccessfully revoked all access tokens for identity with ID: ${identityResponse.communicationUserId}`);

  //await identityClient.deleteUser(identityResponse);
  //console.log(`\nDeleted the identity with ID: ${identityResponse.communicationUserId}`);
};

main().catch((error) => {
  console.log("Encountered an error");
  console.log(error);
})