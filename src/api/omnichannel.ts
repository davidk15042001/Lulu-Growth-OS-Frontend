import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type OmniMessage = { id:string; conversationId:string; direction:string; senderType:string; messageType:string; textContent:string|null; status:string; createdAt:string; sentAt?:string|null; receivedAt?:string|null };
export type OmniConversation = { id:string; workspaceId:string; channelId:string; channelIdentityId:string; status:string; priority:string; handlingMode:string; language:string|null; subject:string|null; assignedUserId:string|null; lastMessageAt:string|null; createdAt:string; messageCount?:number; unreadCount?:number; channelDisplayName?:string; identityDisplayName?:string };
export type OmniChannel = { id:string; channelType:string; provider:string; status:string; displayName:string; capabilities:Record<string,boolean>; identities:Array<{id:string;workspaceId:string|null;websiteId:string|null;displayName:string;mode:string;status:string;defaultLanguage:string|null;capabilities:Record<string,boolean>}> };
const path = (workspaceId:string, suffix:string) => workspaceApiPath(workspaceId, `/omnichannel${suffix}`);
export const omnichannelApi = {
  conversations: (workspaceId:string, query='') => requestApi<{items:OmniConversation[];pagination:{page:number;limit:number;total:number}}>({path:path(workspaceId, `/conversations${query ? `?${query}` : ''}`)}),
  conversation: (workspaceId:string,id:string) => requestApi<{conversation:OmniConversation;messages:OmniMessage[];participants:Array<Record<string,unknown>>}>({path:path(workspaceId, `/conversations/${encodeURIComponent(id)}`)}),
  send: (workspaceId:string,id:string,text:string,clientMessageId:string) => requestApi<OmniMessage>({path:path(workspaceId, `/conversations/${encodeURIComponent(id)}/messages`),method:'POST',body:{text,messageType:'TEXT',clientMessageId}}),
  note: (workspaceId:string,id:string,text:string) => requestApi<OmniMessage>({path:path(workspaceId, `/conversations/${encodeURIComponent(id)}/notes`),method:'POST',body:{text}}),
  update: (workspaceId:string,id:string,input:Record<string,unknown>) => requestApi<OmniConversation>({path:path(workspaceId, `/conversations/${encodeURIComponent(id)}`),method:'PATCH',body:input}),
  takeOver: (workspaceId:string,id:string) => requestApi<OmniConversation>({path:path(workspaceId, `/conversations/${encodeURIComponent(id)}/take-over`),method:'POST',body:{}}),
  returnToAi: (workspaceId:string,id:string,mode:'AI_AUTO'|'AI_ASSISTED'='AI_ASSISTED') => requestApi<OmniConversation>({path:path(workspaceId, `/conversations/${encodeURIComponent(id)}/return-to-ai`),method:'POST',body:{mode}}),
  channels: (workspaceId:string) => requestApi<OmniChannel[]>({path:path(workspaceId, '/channels')}),
  analytics: (workspaceId:string) => requestApi<Record<string,number>>({path:path(workspaceId, '/analytics')}),
  createWebsiteChat: (workspaceId:string,websiteId:string,input?:Record<string,unknown>) => requestApi<Record<string,unknown>>({path:path(workspaceId, '/channels/website-chat'),method:'POST',body:{websiteId,...input}}),
};
