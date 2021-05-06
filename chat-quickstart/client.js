import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';

// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
console.log(connectionString);

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);

// Create User Identity
 //let identityResponse = await identityClient.createUser();
 //console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

// Issue an access token with the "chat" scope for an identity
let tokenResponse = await identityClient.getToken(identityResponse, ["chat"]);
const { token, expiresOn } = tokenResponse;
console.log(`\nIssued an access token with 'chat' scope that expires at ${expiresOn}:`);
console.log(token);

// Your unique Azure Communication service endpoint
let endpointUrl = 'https://haroldtest.communication.azure.com';
// The user access token generated as part of the pre-requisites
let userAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjBkNGVlMWJhLTVhZGUtNGYyNS05ODA0LWYyZjMwNzNmMjg2Zl8wMDAwMDAwOS1kODU0LWMzNGEtNTcwYy0xMTNhMGQwMGRhMDEiLCJzY3AiOjE3OTIsImNzaSI6IjE2MjAxNDk3MzkiLCJpYXQiOjE2MjAxNDk3MzksImV4cCI6MTYyMDIzNjEzOSwiYWNzU2NvcGUiOiJjaGF0IiwicmVzb3VyY2VJZCI6IjBkNGVlMWJhLTVhZGUtNGYyNS05ODA0LWYyZjMwNzNmMjg2ZiJ9.Wng0WUSlZcesKRx2h0Ds2ctYOTuZ4K7hmEeG9U1AYyi8s88yC5ZCEFDxNCmaZ1qZqqXMQj5Y4b5YXYytKbomMw15RvVZLQNw7u4F3ZJ4KbHlTDiwf8iBqcKQDRvcpIWdNeKIAA7ZqqESmQFr7Xjc9Zga6qeAWhg21_NHzIt9GV-BnzhJh67seVfr8ah3CrWQJ7HpxEn1MkeirR7A8rFzUyCtdc6F2gHgmWfnFhUdlmWQX_ICVRWBeSo_lOoqr7-4vbevaESWYKvT4Iq94uvyP5PDsS-rKTAS8HgpAzvLG-1ITsU6Zb80XBOQuStre8aOMT0jxKxTeRvMN-KWwaYsGw';

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken));
console.log('Azure Communication Chat client created!');


async function createChatThread() {
  const createChatThreadRequest = {
    topic: "Hello, World!-7"
  };
  const createChatThreadOptions = {
    participants: [
      {
        id: {
          id: "8:acs:0d4ee1ba-5ade-4f25-9804-f2f3073f286f_00000009-d854-c34a-570c-113a0d00da01"
        },
        displayName: 'Harold-0504'
      }
    ]
  };
  
  const createChatThreadResult = await chatClient.createChatThread(
    createChatThreadRequest,
    createChatThreadOptions
  );
  const threadId = createChatThreadResult.chatThread.id;
  return threadId;
}

/*
createChatThread().then(async threadId => {
    console.log(`Thread created:${threadId}`);
    //list all chat threads
    const threads = chatClient.listChatThreads();
    for await (const thread of threads) {
      console.log(thread)
    }
    // PLACEHOLDERS
    // <CREATE CHAT THREAD CLIENT>
    // <RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>
    // <SEND MESSAGE TO A CHAT THREAD>
    // <LIST MESSAGES IN A CHAT THREAD>
    // <ADD NEW PARTICIPANT TO THREAD>
    // <LIST PARTICIPANTS IN A THREAD>
    // <REMOVE PARTICIPANT FROM THREAD>
});
*/

async function getChatThread() {
  const threads = chatClient.listChatThreads();
  let thread_list = [];
  for await (const thread of threads) {
    console.log(thread);
    thread_list.push(thread);
  }
  return thread_list;
}

getChatThread().then(async thread_list => {
  //console.log(thread_list);
  let threadId = thread_list[0].id;
  let chatThreadClient = chatClient.getChatThreadClient(threadId);
  console.log(`Chat Thread client for threadId:${threadId}`);

  const sendMessageRequest =
  {
    content: 'Hello Bary! Can you share the deck for the conference?'
  };
  let sendMessageOptions =
  {
    senderDisplayName : 'Harold-0504',
    type: 'text'
  };
  const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
  const messageId = sendChatMessageResult.id;
  console.log(`Message sent!, message id:${messageId}`);

  const messages = chatThreadClient.listMessages();
  console.log(`Messages under thread ${thread_list[0].topic}`);
  for await (const message of messages) {
    // your code here
    //console.log(message);
    console.log(`${message.content.message} by ${message.senderDisplayName} at ${message.createdOn}`);
  }
});

